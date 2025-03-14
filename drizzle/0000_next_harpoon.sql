CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"oauth_id" varchar(255),
	"profile_picture_url" varchar(2048),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "students_student_id_unique" UNIQUE("student_id"),
	CONSTRAINT "students_email_unique" UNIQUE("email"),
	CONSTRAINT "students_oauth_id_unique" UNIQUE("oauth_id")
);
