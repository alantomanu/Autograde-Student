import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Ensuring the redirect URI is correct for both local and production
      redirectUri: process.env.NEXTAUTH_URL + '/api/auth/callback/google',
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Optional: custom sign-in page
  },
});
