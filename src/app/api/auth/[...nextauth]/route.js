import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import sql from "@/lib/db"; // Tu conector a Neon

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return false;
      
      // Filtro de seguridad por dominio
      if (!profile.email.toLowerCase().endsWith("@klinman.com")) return false;

      try {
        // Consulta directa con Postgres
        const result = await sql`
          SELECT id FROM usuarios 
          WHERE LOWER(email) = LOWER(${profile.email}) AND estado = TRUE
        `;

        return result.length > 0;
      } catch (error) {
        console.error("Error SQL en signIn (Neon):", error);
        return false;
      }
    },
    async jwt({ token, profile }) {
      if (profile?.email) {
        try {
          const result = await sql`
            SELECT id FROM usuarios WHERE LOWER(email) = LOWER(${profile.email})
          `;
          
          if (result.length > 0) {
            token.userId = result[0].id;
          }
        } catch (error) {
          console.error("Error en JWT callback (Neon):", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };