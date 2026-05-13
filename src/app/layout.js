import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Klinman",
  description: "Servicios de limpieza y mantenimiento",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* Único Toaster centralizado */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#1f4d3a", // El verde oscuro de Klinman
              color: "#fff",
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #c8a96a", // El toque dorado
              fontSize: "14px",
            },
          }}
        />

      </body>
    </html>
  );
}