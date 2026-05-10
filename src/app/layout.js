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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#16a34a",
              color: "#fff",
              padding: "16px",
              borderRadius: "10px",
              fontSize: "14px",
            },
          }}
        />

      </body>
    </html>
  );
}