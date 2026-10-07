import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Sofia_Sans, Sofia_Sans_Extra_Condensed, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PostsProvider } from "@/context/PostsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchPostSummaries } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// pages are rebuilt in the background at most once a minute, so new posts reach crawlers quickly
export const revalidate = 60;

// headings
const sofiaCondensed = Sofia_Sans_Extra_Condensed({
  subsets: ["latin", "greek"],
  variable: "--font-sofia-condensed",
});

// body text and UI labels
const sofiaSans = Sofia_Sans({
  subsets: ["latin", "greek"],
  style: ["normal", "italic"],
  variable: "--font-sofia",
});

const pressStart = Press_Start_2P({
  subsets: ["latin", "greek"],
  weight: "400",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "el_GR",
    url: "/",
  },
  icons: {
    icon: "/small_logo.svg",
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialPosts = await fetchPostSummaries();

  return (
    <html lang="el" className="scroll-smooth">
      <body className={`${sofiaCondensed.variable} ${sofiaSans.variable} ${pressStart.variable} font-sans bg-[#009DF8] text-black antialiased`}>
        <AuthProvider>
          <PostsProvider initialPosts={initialPosts}>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PostsProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3765295950990693"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
