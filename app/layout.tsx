import type React from "react"
import type { Metadata } from "next"
import { Caveat } from "next/font/google"
import { Press_Start_2P } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "700"],
})

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-press-start",
  weight: "400",
})

export const metadata: Metadata = {
  title: "Happy Birthday Cole! 🎂",
  description: "Interactive birthday website with messages from fans, confetti effects, music, and animations! Leave a birthday wish for Cole.",
  generator: "v0.app",
  
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "Happy Birthday Cole! 🎂",
    description: "Interactive birthday website with messages from fans, confetti effects, music, and animations! Leave a birthday wish for Cole.",
    url: "https://happybirthdaycole-oe4wjssjf-lbidasabrina-6328s-projects.vercel.app",
    siteName: "Cole's Birthday Website",
    images: [
      {
        url: "/og-image.jpg", // We'll create this
        width: 1200,
        height: 630,
        alt: "Happy Birthday Cole - Interactive Birthday Website",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Happy Birthday Cole! 🎂",
    description: "Interactive birthday website with messages, confetti, music & animations! Leave Cole a birthday wish 🎾",
    images: ["/og-image.jpg"], // Same image
    creator: "@s7brinas",
  },
  
  // Additional meta tags
  keywords: ["birthday", "Cole", "interactive", "messages", "celebration", "pokemon", "tennis"],
  authors: [{ name: "s7brinas" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${caveat.variable} ${pressStart.variable}`}>
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
