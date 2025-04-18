import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="container py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tighter">Privacy Policy</h1>
            <p className="mt-4 text-muted-foreground">Last updated: April 15, 2023</p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="mb-4">
              At FindIt, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and services.
            </p>
            <p className="mb-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
              please do not access the site or use our services.
            </p>
          </section>

          {/* Table of Contents */}
          <section className="mb-8 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-bold">Table of Contents</h2>
            <ol className="list-inside list-decimal space-y-2">
              <li>
                <a href="#collection" className="text-primary hover:underline">
                  Information We Collect
                </a>
              </li>
              <li>
                <a href="#use" className="text-primary hover:underline">
                  How We Use Your Information
                </a>
              </li>
              <li>
                <a href="#disclosure" className="text-primary hover:underline">
                  Disclosure of Your Information
                </a>
              </li>
              <li>
                <a href="#security" className="text-primary hover:underline">
                  Security of Your Information
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-primary hover:underline">
                  Cookies and Web Beacons
                </a>
              </li>
              <li>
                <a href="#thirdparty" className="text-primary hover:underline">
                  Third-Party Websites
                </a>
              </li>
              <li>
                <a href="#children" className="text-primary hover:underline">
                  Children's Privacy
                </a>
              </li>
              <li>
                <a href="#rights" className="text-primary hover:underline">
                  Your Privacy Rights
                </a>
              </li>
              <li>
                <a href="#changes" className="text-primary hover:underline">
                  Changes to This Privacy Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary hover:underline">
                  Contact Us
                </a>
              </li>
            </ol>
          </section>

          {/* Information We Collect */}
          <section className="mb-8" id="collection">
            <h2 className="mb-4 text-2xl font-bold">1. Information We Collect</h2>
            <h3 className="mb-2 text-xl font-semibold">Personal Data</h3>
            <p className="mb-4">
              When you register for an account, report a lost or found item, or contact us, we may collect personally
              identifiable information, such as:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>Your name, email address, and contact information</li>
              <li>Profile information and photos you choose to provide</li>
              <li>Information about lost or found items, including descriptions and photos</li>
              <li>Location data related to lost or found items</li>
              <li>Communications between users regarding lost and found items</li>
            </ul>

            <h3 className="mb-2 text-xl font-semibold">Automatically Collected Information</h3>
            <p className="mb-4">
              When you access our website, we may automatically collect certain information about your device,
              including:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>IP address and browser type</li>
              <li>Operating system</li>
              <li>Pages you visit on our site</li>
              <li>Time and date of your visit</li>
              <li>Time spent on those pages</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8" id="use">
            <h2 className="mb-4 text-2xl font-bold">2. How We Use Your Information</h2>
            <p className="mb-4">We may use the information we collect for various purposes, including to:</p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>Create and manage your account</li>
              <li>Provide and maintain our services</li>
              <li>Match lost items with found items</li>
              <li>Facilitate communication between users regarding lost and found items</li>
              <li>Send you notifications about potential matches or updates to your reports</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Monitor usage of our services</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Disclosure of Your Information */}
          <section className="mb-8" id="disclosure">
            <h2 className="mb-4 text-2xl font-bold">3. Disclosure of Your Information</h2>
            <p className="mb-4">We may disclose your personal information in the following situations:</p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>
                <strong>To Other Users:</strong> When you report a lost or found item, certain information (such as item
                description, location, and your contact method) may be visible to other users to facilitate matching and
                recovery.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share your information with third-party vendors, service
                providers, and other third parties who perform services on our behalf.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a
                portion of our assets, your information may be transferred as part of that transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
                response to valid requests by public authorities.
              </li>
              <li>
                <strong>Protection of Rights:</strong> We may disclose your information to protect and defend our rights
                or property, or the safety of our users or others.
              </li>
            </ul>
          </section>

          {/* Security of Your Information */}
          <section className="mb-8" id="security">
            <h2 className="mb-4 text-2xl font-bold">4. Security of Your Information</h2>
            <p className="mb-4">
              We use administrative, technical, and physical security measures to protect your personal information.
              While we have taken reasonable steps to secure the personal information you provide to us, please be aware
              that despite our efforts, no security measures are perfect or impenetrable, and no method of data
              transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          {/* Cookies and Web Beacons */}
          <section className="mb-8" id="cookies">
            <h2 className="mb-4 text-2xl font-bold">5. Cookies and Web Beacons</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to track activity on our website and hold certain
              information. Cookies are files with a small amount of data which may include an anonymous unique
              identifier.
            </p>
            <p className="mb-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
              if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>To keep you signed in</li>
              <li>To understand how you use our website</li>
              <li>To remember your preferences</li>
              <li>To help us improve our services</li>
            </ul>
          </section>

          {/* Third-Party Websites */}
          <section className="mb-8" id="thirdparty">
            <h2 className="mb-4 text-2xl font-bold">6. Third-Party Websites</h2>
            <p className="mb-4">
              Our website may contain links to third-party websites that are not operated by us. If you click on a
              third-party link, you will be directed to that third party's site. We strongly advise you to review the
              Privacy Policy of every site you visit.
            </p>
            <p className="mb-4">
              We have no control over and assume no responsibility for the content, privacy policies, or practices of
              any third-party sites or services.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8" id="children">
            <h2 className="mb-4 text-2xl font-bold">7. Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for use by children under the age of 13. We do not knowingly collect
              personally identifiable information from children under 13. If you are a parent or guardian and you are
              aware that your child has provided us with personal data, please contact us. If we become aware that we
              have collected personal data from children without verification of parental consent, we take steps to
              remove that information from our servers.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section className="mb-8" id="rights">
            <h2 className="mb-4 text-2xl font-bold">8. Your Privacy Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>The right to access personal information we hold about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>
          </section>

          {/* Changes to This Privacy Policy */}
          <section className="mb-8" id="changes">
            <h2 className="mb-4 text-2xl font-bold">9. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p className="mb-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-8" id="contact">
            <h2 className="mb-4 text-2xl font-bold">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@findit.com" className="text-primary hover:underline">
                privacy@findit.com
              </a>
            </p>
          </section>

          {/* CTA */}
          <div className="mt-12 rounded-lg bg-muted p-6 text-center">
            <h2 className="text-xl font-bold">Have questions about our privacy practices?</h2>
            <p className="mt-2 text-muted-foreground">We're here to help with any privacy-related concerns.</p>
            <Button className="mt-4" asChild>
              <Link href="/contact">
                Contact Our Privacy Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
