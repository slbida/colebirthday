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
  description: "Birthday fan wall for Cole Preston - made by @s7brinas",
  generator: "v0.app",
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
