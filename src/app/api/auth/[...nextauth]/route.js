import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import sql from "mssql";

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // Necesario para que el ID persista en el token
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return false;
      if (!profile.email.toLowerCase().endsWith("@klinman.com")) return false;

      try {
        const pool = await sql.connect(dbConfig);
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
      // Si es el primer inicio de sesión, buscamos el ID y lo guardamos en el token
      if (profile?.email) {
        try {
          const pool = await sql.connect(dbConfig);
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
      // Pasamos el ID del token a la sesión
      if (token.userId) {
        session.user.id = token.userId;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };