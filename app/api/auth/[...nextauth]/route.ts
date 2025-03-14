import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { students } from "@/drizzle/schema";

// Extend the built-in types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      image?: string | null;
      name?: string | null;
      studentId?: string;
    }
  }

  interface User {
    studentId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Student ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            return null;
          }

          const student = await db.query.students.findFirst({
            where: eq(students.studentId, credentials.identifier),
          });

          if (!student || !student.password) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            student.password
          );

          if (!isValid) {
            return null;
          }

          return {
            id: student.id.toString(),
            email: student.email,
            name: student.name,
            image: student.profilePictureUrl,
            studentId: student.studentId,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existingStudent = await db.query.students.findFirst({
          where: eq(students.email, user.email),
        });

        if (!existingStudent) {
          return `/signup?oauth=google&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || '')}&image=${encodeURIComponent(user.image || '')}&oauthId=${user.id}`;
        }

        // Update oauthId if not set
        if (!existingStudent.oauthId) {
          await db.update(students)
            .set({ oauthId: user.id })
            .where(eq(students.email, user.email));
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (user.studentId) {
          token.studentId = user.studentId;
        }
        else if (account?.provider === "google" && token.email) {
          const student = await db.query.students.findFirst({
            where: eq(students.email, token.email),
          });
          if (student) {
            token.studentId = student.studentId;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.studentId) {
        session.user.studentId = token.studentId as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 