import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { students } from "@/drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, studentId, name, password, oauthId, profilePictureUrl } = body;

    // Check if student already exists
    const existingStudent = await db.query.students.findFirst({
      where: eq(students.studentId, studentId),
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Student ID already exists" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.query.students.findFirst({
      where: eq(students.email, email),
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: "Email address is already registered" },
        { status: 400 }
      );
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create new student
    const newStudent = await db.insert(students).values({
      email,
      studentId,
      name,
      password: hashedPassword,
      oauthId,
      profilePictureUrl,
    }).returning();

    return NextResponse.json({ 
      message: "Student registered successfully",
      student: newStudent[0]
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 