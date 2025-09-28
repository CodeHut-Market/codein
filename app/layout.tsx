import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import Footer from "../components/Footer"
import Navigation from "../components/Navigation"
import "./globals.css"
import Providers from "./providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "CodeHut - Build. Share. Ship.",
  description: "A focused starter integrating Next.js App Router, Supabase auth, Tailwind theming, and modular architecture.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-background text-foreground flex flex-col">
        <Providers>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
