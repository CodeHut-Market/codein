import ThemeSwitcher from "./components/ThemeSwitcher";
          <ThemeSwitcher />
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Footer from "../components/Footer"
import Navigation from "../components/Navigation"
import "./globals.css"
import Providers from "./providers"
import { RealTimePerformanceMonitor } from "./components/ui/real-time-performance-monitor"

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
      <body className="font-sans min-h-screen bg-gradient-to-br from-indigo-50 via-sky-100 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-foreground flex flex-col transition-all duration-500">
        <Providers>
          <Navigation />
          <main className="flex-1 relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(80,120,255,0.10),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(80,120,255,0.10),transparent_70%)] z-0" />
            <div className="relative z-10">
              {children}
            </div>
          </main>
          <Footer />
          <RealTimePerformanceMonitor />
        </Providers>
      </body>
    </html>
  )
}
