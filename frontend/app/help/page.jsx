"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import SidebarNav from "@/components/sidebar-nav"
import MobileNav from "@/components/mobile-nav"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // FAQ data
  const faqs = [
    {
      question: "How do I report a lost item?",
      answer:
        "To report a lost item, click on the 'Post Item' button in the navigation menu, select 'Lost' as the item type, and fill out the form with as much detail as possible about your lost item, including photos, location where it was lost, and your contact information.",
    },
    {
      question: "How do I report a found item?",
      answer:
        "To report a found item, click on the 'Post Item' button in the navigation menu, select 'Found' as the item type, and provide details about the item you found, where you found it, and your contact information so the owner can reach out to you.",
    },
    {
      question: "How can I contact someone who found my item?",
      answer:
        "When you find a listing that matches your lost item, you can click on the 'Contact' or 'Message' button on the item card. This will allow you to send a message directly to the finder or view their contact information if they've made it public.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "We take privacy seriously. Your contact information is only shared with users who need to contact you about a lost or found item. You can control what information is visible in your profile settings.",
    },
    {
      question: "How do I know if an item listing is legitimate?",
      answer:
        "Look for the verification count on item listings. Items with higher verification counts have been confirmed by multiple users. You can also check the user's profile and activity history for additional verification.",
    },
    {
      question: "What should I do if I suspect a fraudulent listing?",
      answer:
        "If you suspect a listing is fraudulent, click the 'Report' option in the item's dropdown menu. Our team will review the report and take appropriate action. You can also flag the item directly from the listing.",
    },
    {
      question: "How long do listings stay active?",
      answer:
        "Listings remain active for 30 days by default. You can extend or remove your listing at any time from your profile page under 'My Items'.",
    },
    {
      question: "Can I edit my listing after posting?",
      answer:
        "Yes, you can edit your listing at any time. Go to your profile, find the listing under 'My Items', and click the edit button to make changes.",
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Hidden on mobile */}
      <SidebarNav className="hidden lg:block" />

      {/* Main Content */}
      <main className="flex-1 border-x pb-20 lg:pb-0">
        <Navbar />
        <div className="container max-w-4xl px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
            <p className="text-muted-foreground">Find answers to common questions and get support</p>
          </div>

          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for help..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="faq">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="contact">Contact Us</TabsTrigger>
                <TabsTrigger value="about">About FindKer</TabsTrigger>
              </TabsList>

              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to the most common questions about FindKer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                          </AccordionItem>
                        ))
                      ) : (
                        <p className="text-center py-4 text-muted-foreground">
                          No results found for "{searchQuery}". Try a different search term.
                        </p>
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                    <CardDescription>Get in touch with our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Email</p>
                              <a href="mailto:ahsan24naeem@gmail.com" className="text-sm text-primary hover:underline">
                                ahsan24naeem@gmail.com
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <a href="tel:03248403266" className="text-sm text-primary hover:underline">
                                03248403266
                              </a>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="font-medium">Address</p>
                              <address className="text-sm not-italic">
                                FAST-NUCES, Lahore
                              </address>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About FindKer</CardTitle>
                    <CardDescription>Learn more about our mission and company</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Our Mission</h3>
                      <p>
                        FindKer was founded with a simple mission: to help people reconnect with their lost belongings
                        and to create a community of helpful individuals who can assist each other in times of need.
                      </p>
                      <p>
                        We believe that losing something important shouldn't be a permanent loss. By leveraging
                        technology and community, we can increase the chances of recovering lost items and bring peace
                        of mind to those who have lost something valuable to them.
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Our Story</h3>
                      <p>
                        FindKer was founded in 2020 after our founder lost his laptop at an airport and had no efficient
                        way to try to recover it. Realizing that many others face similar situations daily, we set out
                        to create a platform that makes it easy to report and find lost items.
                      </p>
                      <p>
                        Since then, we've helped thousands of people recover their lost belongings, from everyday items
                        like keys and wallets to precious family heirlooms and irreplaceable personal items.
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Company Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">FindKer Inc.</p>
                          <address className="not-italic text-sm text-muted-foreground">
                            FAST-NUCES, Lahore
                          </address>
                        </div>
                        <div>
                          <p className="font-medium">Contact</p>
                          <p className="text-sm text-muted-foreground">Email: ahsan24naeem@gmail.com</p>
                          <p className="text-sm text-muted-foreground">Phone: 03248403266</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/about">
                        Learn More About FindKer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
