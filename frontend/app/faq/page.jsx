import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function FAQPage() {
  // FAQ categories and questions
  const faqCategories = [
    {
      title: "General Questions",
      questions: [
        {
          question: "What is FindIt?",
          answer:
            "FindIt is a social platform that helps people report lost items, find recovered items, and connect with their community to get their belongings back. We use advanced matching algorithms and location-based services to increase the chances of recovery.",
        },
        {
          question: "Is FindIt free to use?",
          answer:
            "Yes, FindIt is free to use for basic features. We offer premium features for a small subscription fee, but most users can successfully use the platform without any payment.",
        },
        {
          question: "How does FindIt work?",
          answer:
            "Users can report lost items or found items on our platform. Our system then uses descriptions, locations, and other details to suggest potential matches. Users can browse listings, get notifications for potential matches, and communicate securely through our platform to arrange returns.",
        },
        {
          question: "Is my personal information safe?",
          answer:
            "We take privacy and security seriously. Your personal contact information is never publicly displayed, and we use secure verification methods for item claims. You can review our Privacy Policy for more details on how we protect your information.",
        },
      ],
    },
    {
      title: "Reporting Lost Items",
      questions: [
        {
          question: "How do I report a lost item?",
          answer:
            "To report a lost item, click on the 'Post' button and select 'Lost Item'. Fill out the form with as much detail as possible, including description, location where it was lost, date, and photos if available. The more information you provide, the better chance of finding a match.",
        },
        {
          question: "What details should I include in my lost item report?",
          answer:
            "Include a detailed description (color, brand, size, etc.), the location where you last had the item, the date and time it was lost, any identifying features, and clear photos if available. For valuable items, you might want to include only partial identifying information (like the last 4 digits of a serial number) to verify ownership later.",
        },
        {
          question: "Can I edit my lost item report after posting?",
          answer:
            "Yes, you can edit your report at any time. Simply go to your profile, find the report under 'My Posts', and click the edit button. You can update details, add more information, or mark it as found if you've recovered your item.",
        },
        {
          question: "How long will my lost item report stay active?",
          answer:
            "Lost item reports remain active for 90 days by default. You can extend this period from your profile if needed. We recommend updating your report periodically with any new information to keep it relevant.",
        },
      ],
    },
    {
      title: "Reporting Found Items",
      questions: [
        {
          question: "How do I report a found item?",
          answer:
            "To report a found item, click on the 'Post' button and select 'Found Item'. Provide details about the item, where and when you found it, and upload photos if possible. Be careful not to include too many identifying details that only the owner would know, as these can help verify ownership.",
        },
        {
          question: "Should I include all details about the found item?",
          answer:
            "No, you should include general details but withhold some specific identifying features that only the true owner would know. This helps verify ownership when someone claims the item. For example, mention that you found a wallet, but don't list all the cards inside.",
        },
        {
          question: "What should I do with the found item while waiting for the owner?",
          answer:
            "Keep the item safe and secure. Depending on what it is, you might also consider turning it in to local authorities or a lost and found office while still maintaining your listing on FindIt. You can update your post to indicate where the item can be claimed.",
        },
        {
          question: "Am I legally required to turn in found items to authorities?",
          answer:
            "Laws vary by location, but many places do require valuable found items to be turned in to police or appropriate authorities. FindIt is a supplementary service to help connect finders and owners, not a replacement for legal obligations. Check your local laws regarding found property.",
        },
      ],
    },
    {
      title: "Matching & Claiming",
      questions: [
        {
          question: "How does the matching system work?",
          answer:
            "Our matching system uses details like item description, category, location, and time to suggest potential matches between lost and found reports. The system automatically notifies users of potential matches, and users can also browse and search for matches manually.",
        },
        {
          question: "How do I claim an item that I believe is mine?",
          answer:
            "If you find a listing for an item you believe is yours, click the 'Claim This Item' button on the listing. You'll be asked to provide specific details about the item that only the owner would know. This information is sent to the finder for verification.",
        },
        {
          question: "How does the verification process work?",
          answer:
            "When someone claims an item, they provide specific identifying details. The finder reviews these details to confirm if they match the found item. If verified, both parties can communicate through our platform to arrange the return. This process protects both parties and ensures items return to their rightful owners.",
        },
        {
          question: "What if someone falsely claims my found item?",
          answer:
            "Our verification system is designed to prevent false claims by requiring specific details that only the true owner would know. If you receive a claim that doesn't match the item's details, you can reject it. If you experience persistent false claims, please contact our support team.",
        },
      ],
    },
    {
      title: "Account & Settings",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "Click the 'Sign Up' button in the top right corner of the homepage. You can register using your email, or sign up with Google or Facebook for quicker access. You'll need to verify your email address to complete registration.",
        },
        {
          question: "Can I use FindIt without creating an account?",
          answer:
            "You can browse lost and found listings without an account, but you'll need to create one to post items, contact users, or claim items. Creating an account helps us maintain a secure and trustworthy community.",
        },
        {
          question: "How do I change my notification settings?",
          answer:
            "Go to your profile and click on 'Settings', then 'Notifications'. Here you can customize which notifications you receive and how you receive them (email, push, or in-app).",
        },
        {
          question: "How do I delete my account?",
          answer:
            "Go to 'Settings', then 'Privacy & Security', and scroll to the bottom where you'll find the 'Delete Account' option. Note that deleting your account will remove all your posts and personal information from our system.",
        },
      ],
    },
  ]

  return (
    <>
      <Navbar />
      <main className="container py-12">
        {/* Hero Section */}
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about using FindIt to report and recover lost items.
          </p>

          {/* Search */}
          <div className="mt-8 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search for answers..." className="pl-10" />
            </div>
            <Button>Search</Button>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="mt-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {faqCategories.map((category, index) => (
              <div key={index} className="rounded-lg border p-6">
                <h2 className="text-xl font-bold">{category.title}</h2>
                <ul className="mt-4 space-y-2">
                  {category.questions.slice(0, 3).map((faq, faqIndex) => (
                    <li key={faqIndex}>
                      <Link
                        href={`#${category.title.toLowerCase().replace(/\s+/g, "-")}-${faqIndex}`}
                        className="text-primary hover:underline"
                      >
                        {faq.question}
                      </Link>
                    </li>
                  ))}
                </ul>
                {category.questions.length > 3 && (
                  <p className="mt-2 text-sm text-muted-foreground">+{category.questions.length - 3} more questions</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordions */}
        <section className="mt-16">
          {faqCategories.map((category, index) => (
            <div key={index} className="mb-12">
              <h2 className="mb-6 text-2xl font-bold" id={category.title.toLowerCase().replace(/\s+/g, "-")}>
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`item-${index}-${faqIndex}`}
                    id={`${category.title.toLowerCase().replace(/\s+/g, "-")}-${faqIndex}`}
                  >
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </section>

        {/* Still Have Questions */}
        <section className="mt-16 rounded-lg bg-muted p-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold">Still Have Questions?</h2>
            <p className="mt-4 text-muted-foreground">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/contact">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
