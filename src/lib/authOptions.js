import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.email) {
        // Aquí podrías agregar la consulta SQL para buscar el ID si quieres que sea ultra rápido
        token.email = profile.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};