import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
    matcher: [
      // Add routes that need authentication
      "/dashboard/:path*",
      "/evaluation/:path*",
      "/profile/:path*", // New protected route
      "/settings/:path*", // Another new protected route
    ],
  };