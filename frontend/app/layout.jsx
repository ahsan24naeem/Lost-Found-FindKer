import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "FindIt - Lost and Found Platform",
  description: "A platform to help people find their lost items and return found items to their owners",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="min-h-screen bg-background">
              {children}
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


import './globals.css'