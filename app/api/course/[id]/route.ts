import { db } from "@/drizzle/db";
import { scores, courses, students } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // First get the student
        const student = await db.query.students.findFirst({
            where: eq(students.email, session.user.email),
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Await params before using them
        const courseId = params.id; // Await the params

        // Fetch the score and course details
        const score = await db
            .select({
                id: scores.id,
                totalMarks: scores.totalMarks,
                maxMarks: scores.maxMarks,
                percentage: scores.percentage,
                answerSheetUrl: scores.answerSheetUrl,
                feedback: scores.feedback,
                courseName: courses.courseName,
                courseCode: courses.courseCode,
                teacherId: scores.checkedByTeacherId,
            })
            .from(scores)
            .leftJoin(courses, eq(scores.courseId, courses.id))
            .where(
                and(
                    eq(scores.courseId, parseInt(courseId)), // Use the awaited courseId
                    eq(scores.studentId, student.studentId)
                )
            )
            .limit(1);

        if (!score || score.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Get all scores for this course to calculate rank and class average
        const allScores = await db
            .select({
                percentage: scores.percentage,
            })
            .from(scores)
            .where(eq(scores.courseId, parseInt(courseId))); // Use the awaited courseId

        const classAverage = allScores.reduce((acc, curr) => acc + curr.percentage, 0) / allScores.length;
        const betterScores = allScores.filter(s => s.percentage > score[0].percentage);
        const rank = betterScores.length + 1;

        return NextResponse.json({
            ...score[0],
            rank,
            classAverage: Math.round(classAverage * 100) / 100,
        });
    } catch (error) {
        console.error('Error in course detail route:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 