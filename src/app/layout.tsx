import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PostsProvider } from "@/context/PostsContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ο Συνήθης Θεατής",
  description: "Κριτικές, αφιερώματα και νέα κινηματογράφου",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className={`${geist.className} bg-[#FAFAF7] text-zinc-800 antialiased`}>
        <AuthProvider>
          <PostsProvider>
            <AnnouncementBar />
            <Header />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
