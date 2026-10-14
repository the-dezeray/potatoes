import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";
import { Navbar } from "@/components/navbar";
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelTriangle, GeistPixelLine } from 'geist/font/pixel';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biustinnovation.com"),
  title: {
    default: "BIUST Innovation Club | Student Tech & Innovation in Botswana",
    template: "%s | BIUST Innovation Club",
  },
  description:
    "BIUST Innovation Club — the student tech and innovation club at Botswana International University of Science and Technology (BIUST), Palapye. Projects, hack nights, courses, and community.",
  keywords: [
    "BIUST Innovation Club",
    "BIUST",
    "Botswana tech",
    "Palapye",
    "student developers",
    "hackathons Botswana",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "BIUST Innovation Club",
    locale: "en",
    url: "https://biustinnovation.com",
    title: "BIUST Innovation Club | Student Tech & Innovation in Botswana",
    description:
      "Student-run tech club at BIUST Palapye. We build real projects, host hack nights, and grow Botswana's tech talent.",
    images: [{ url: "/image10.webp", width: 1200, height: 630, alt: "BIUST Innovation Club" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIUST Innovation Club",
    description: "Student tech & innovation club at BIUST, Botswana. Build, learn, ship.",
    images: ["/image10.webp"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelTriangle.variable} ${GeistPixelLine.variable} ${GeistPixelCircle.variable} ${GeistPixelSquare.variable} ${GeistPixelGrid.variable} antialiased`}
      >
        <AppProviders>
          <Navbar />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
