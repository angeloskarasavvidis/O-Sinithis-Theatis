import type { Metadata } from "next";
import { Noto_Serif_Display, Press_Start_2P, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PostsProvider } from "@/context/PostsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const notoSerifDisplay = Noto_Serif_Display({
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const pressStart = Press_Start_2P({
  subsets: ["latin", "greek"],
  weight: "400",
  variable: "--font-pixel",
});

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin", "greek"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Ο Συνήθης Θεατής",
  description: "Κριτικές, αφιερώματα και νέα κινηματογράφου",
  icons: {
    icon: "/small_logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className={`${notoSerifDisplay.variable} ${pressStart.variable} ${inter.variable} ${manrope.variable} font-serif bg-[#EBEBEB] text-zinc-900 antialiased`}>
        <AuthProvider>
          <PostsProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
