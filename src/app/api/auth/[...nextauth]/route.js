import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getDBConnection, sql } from "@/lib/db"; // Importación correcta

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
        const pool = await getDBConnection(); // Reutiliza la conexión
        const result = await pool.request()
          .input("email", sql.VarChar, profile.email)
          .query("SELECT id FROM usuarios WHERE LOWER(email) = LOWER(@email) AND estado = 1");

        return result.recordset.length > 0;
      } catch (error) {
        console.error("Error SQL en signIn:", error);
        return false;
      }
    },
    async jwt({ token, profile }) {
      if (profile?.email) {
        try {
          const pool = await getDBConnection();
          const result = await pool.request()
            .input("email", sql.VarChar, profile.email)
            .query("SELECT id FROM usuarios WHERE LOWER(email) = LOWER(@email)");
          
          if (result.recordset.length > 0) {
            token.userId = result.recordset[0].id;
          }
        } catch (error) {
          console.error("Error en JWT callback:", error);
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