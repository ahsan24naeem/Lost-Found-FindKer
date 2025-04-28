"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"

export default function AboutPage() {
  const { user } = useAuth()
  const router = useRouter()

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.push("/home")
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/20 to-background py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <circle cx="12" cy="12" r="4"></circle>
                </svg>
              </div>
              {/* <h1 className="text-5xl font-bold text-primary">FindKer</h1> */}
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Reunite with Your Lost Items</h2>
          <p className="text-xl text-muted-foreground mb-8">
            The easiest way to report lost items and find what you're looking for. Our platform connects people who have
            lost items with those who have found them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="px-8">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8">
            <Link href="/register">Create Account</Link>
          </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How FindKer Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Report Lost Items</h3>
                <p className="text-muted-foreground">
                  Quickly create a detailed report about your lost item with photos and location information.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Find Items</h3>
                <p className="text-muted-foreground">
                  Browse through found items or search by category, location, and description to find what you've lost.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Connect & Retrieve</h3>
                <p className="text-muted-foreground">
                  Message directly with the finder of your item and arrange to get your belongings back safely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">10,000+</h3>
              <p className="text-muted-foreground">Items Found</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">15,000+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary">FindKer</h3>
              </div>
              <p className="text-muted-foreground max-w-md">
                FindKer helps people reconnect with their lost items through a community-driven platform.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-primary">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-primary">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="text-muted-foreground hover:text-primary">
                      Help & Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-primary">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="mailto:info@findker.com" className="text-muted-foreground hover:text-primary">
                      Email
                    </a>
                  </li>
                  <li>
                    <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary">
                      Phone
                    </a>
                  </li>
                  <li>
                    <address className="text-muted-foreground not-italic">123 Main St, City</address>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} FindKer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
