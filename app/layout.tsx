import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClientProviders } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MentorBox - Transform Your NEET Journey',
  description: 'Experience personalized learning with AI-driven insights, adaptive testing, and comprehensive analytics. Join 50,000+ students who\'ve achieved their medical dreams with MentorBox.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
          </TooltipProvider>
        </ClientProviders>
      </body>
    </html>
  )
}