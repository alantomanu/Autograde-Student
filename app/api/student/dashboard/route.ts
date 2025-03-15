import { db } from "@/drizzle/db";
import { scores, courses, students } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch student details
        const student = await db.query.students.findFirst({
            where: eq(students.email, session.user.email),
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Fetch all scores for the student using a raw SQL join condition
        const studentScores = await db
            .select({
                id: scores.id,
                courseId: courses.id,
                totalMarks: scores.totalMarks,
                maxMarks: scores.maxMarks,
                percentage: scores.percentage,
                answerSheetUrl: scores.answerSheetUrl,
                courseName: courses.courseName,
                courseCode: courses.courseCode,
                teacherId: scores.checkedByTeacherId,
            })
            .from(scores)
            .leftJoin(
                courses,
                sql`${courses.id} = ${scores.courseId}`
            )
            .where(eq(scores.studentId, student.studentId));

        // Calculate overall performance
        const allScores = await db
            .select({ percentage: scores.percentage })
            .from(scores)
            .where(eq(scores.studentId, student.studentId));

        const overallPercentage = allScores.length > 0 
            ? allScores.reduce((acc, curr) => acc + curr.percentage, 0) / allScores.length 
            : 0;

        // For each course, calculate rank and class average
        const coursesWithRankAndAverage = await Promise.all(
            studentScores.map(async (score) => {
                // Get all scores for this course
                const courseScores = await db
                    .select({ percentage: scores.percentage })
                    .from(scores)
                    .where(eq(scores.courseId, score.courseId!));

                // Calculate class average
                const classAverage = courseScores.length > 0
                    ? courseScores.reduce((acc, curr) => acc + curr.percentage, 0) / courseScores.length
                    : 0;

                // Calculate rank
                const betterScores = courseScores.filter((s) => s.percentage > score.percentage);
                const rank = betterScores.length + 1;

                return {
                    ...score,
                    rank,
                    classAverage,
                };
            })
        );

        // Calculate overall rank
        const allStudentScores = await db
            .select({
                studentId: scores.studentId,
                percentage: scores.percentage,
            })
            .from(scores);

        const studentAverages = allStudentScores.reduce((acc, curr) => {
            if (!acc[curr.studentId]) {
                acc[curr.studentId] = [];
            }
            acc[curr.studentId].push(curr.percentage);
            return acc;
        }, {} as Record<string, number[]>);

        const averages = Object.entries(studentAverages).map(([studentId, percentages]) => ({
            studentId,
            average: percentages.reduce((a, b) => a + b, 0) / percentages.length,
        }));

        const betterAverages = averages.filter((avg) => avg.average > overallPercentage);
        const overallRank = betterAverages.length + 1;
        const totalStudents = Object.keys(studentAverages).length;

        return NextResponse.json({
            student: {
                id: student.id,
                studentId: student.studentId,
                name: student.name,
                email: student.email,
                profilePictureUrl: student.profilePictureUrl,
            },
            courses: coursesWithRankAndAverage,
            overallPerformance: {
                overallPercentage,
                overallRank,
                totalStudents,
            },
        });
    } catch (error) {
        console.error('Error in dashboard route:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 