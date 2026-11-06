import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider";
import ProjectFooter from "@/components/ProjectFooter";
import { Toaster } from "react-hot-toast";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = "A cozy, private journal: write in Markdown, organize with tags, and search your entries.";

export const metadata: Metadata = {
  metadataBase: new URL("https://journal-app-francisco-sucatti.vercel.app"),
  title: "Journal App",
  description,
  // Preview shown when the link is shared in chats and social networks.
  openGraph: { type: "website", title: "Journal App", description, images: [{ url: "/og.jpg", width: 800, height: 420 }] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>{children}</NextAuthProvider>
        <ProjectFooter />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--forest)",
              color: "var(--soft)",
              borderRadius: '1rem',
            },
          }}
        />
      </body>
    </html>
  );
}
