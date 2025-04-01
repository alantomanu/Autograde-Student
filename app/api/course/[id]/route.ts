import { db } from "@/drizzle/db";
import { scores, courses, students } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

interface RawFeedbackItem {
    mark: string | number;
    maxMark: string | number;
    reason?: string;
    questionNumber?: string;
}

interface FeedbackItem {
    mark: number;
    maxMark: number;
    reason: string;
    questionNumber: string;
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        const courseId = parseInt(id);
        if (isNaN(courseId)) {
            return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
        }

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const student = await db.query.students.findFirst({
            where: eq(students.email, session.user.email),
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

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
                    eq(scores.courseId, courseId),
                    eq(scores.studentId, student.studentId)
                )
            )
            .limit(1);

        if (!score || score.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const allScores = await db
            .select({
                percentage: scores.percentage,
            })
            .from(scores)
            .where(eq(scores.courseId, courseId));

        const classAverage =
            allScores.length > 0
                ? allScores.reduce((acc, curr) => acc + curr.percentage, 0) / allScores.length
                : 0;
        
        const betterScores = allScores.filter((s) => s.percentage > score[0].percentage);
        const rank = betterScores.length + 1;

        let parsedFeedback: FeedbackItem[] = [];

        if (score[0].feedback) {
            try {
                const rawFeedback: RawFeedbackItem[] =
                    typeof score[0].feedback === "string"
                        ? JSON.parse(score[0].feedback)
                        : score[0].feedback;

                parsedFeedback = rawFeedback.map((item) => ({
                    mark: Number(item.mark) || 0,
                    maxMark: Number(item.maxMark) || 0,
                    reason: item.reason || "",
                    questionNumber: item.questionNumber || "",
                }));
            } catch (error) {
                console.error("Error parsing feedback:", error);
                parsedFeedback = [];
            }
        }

        return NextResponse.json({
            ...score[0],
            feedback: parsedFeedback,
            rank,
            classAverage: Math.round(classAverage * 100) / 100,
        });
    } catch (error) {
        console.error("Error in course detail route:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
