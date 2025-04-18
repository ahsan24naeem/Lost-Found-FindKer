import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="container py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tighter">Terms of Service</h1>
            <p className="mt-4 text-muted-foreground">Last updated: April 15, 2023</p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="mb-4">
              Welcome to FindIt. These Terms of Service ("Terms") govern your access to and use of the FindIt website,
              mobile applications, and services (collectively, the "Service").
            </p>
            <p className="mb-4">
              Please read these Terms carefully before using our Service. By accessing or using the Service, you agree to
              be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
            </p>
          </section>

          {/* Table of Contents */}
          <section className="mb-8 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-bold">Table of Contents</h2>
            <ol className="list-inside list-decimal space-y-2">
              <li>
                <a href="#accounts" className="text-primary hover:underline">
                  Accounts
                </a>
              </li>
              <li>
                <a href="#content" className="text-primary hover:underline">
                  User Content
                </a>
              </li>
              <li>
                <a href="#conduct" className="text-primary hover:underline">
                  Prohibited Conduct
                </a>
              </li>
              <li>
                <a href="#intellectual" className="text-primary hover:underline">
                  Intellectual Property
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="text-primary hover:underline">
                  Disclaimer of Warranties
                </a>
              </li>
              <li>
                <a href="#limitation" className="text-primary hover:underline">
                  Limitation of Liability
                </a>
              </li>
              <li>
                <a href="#indemnification" className="text-primary hover:underline">
                  Indemnification
                </a>
              </li>
              <li>
                <a href="#termination" className="text-primary hover:underline">
                  Termination
                </a>
              </li>
              <li>
                <a href="#governing" className="text-primary hover:underline">
                  Governing Law
                </a>
              </li>
              <li>
                <a href="#changes" className="text-primary hover:underline">
                  Changes to Terms
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary hover:underline">
                  Contact Us
                </a>
              </li>
            </ol>
          </section>

          {/* Accounts */}
          <section className="mb-8" id="accounts">
            <h2 className="mb-4 text-2xl font-bold">1. Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. Failure
              to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p className="mb-4">
              You are responsible for safeguarding the password that you use to access the Service and for any activities
              or actions under your password. We encourage you to use a strong password (a combination of upper and lower
              case letters, numbers, and symbols) with your account.
            </p>
            <p className="mb-4">
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming
              aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          {/* User Content */}
          <section className="mb-8" id="content">
            <h2 className="mb-4 text-2xl font-bold">2. User Content</h2>
            <p className="mb-4">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text,
              graphics, videos, or other material ("Content") related to lost and found items.
            </p>
            <p className="mb-4">
              You are responsible for the Content that you post on or through the Service, including its legality,
              reliability, and appropriateness. By posting Content on or through the Service, you represent and warrant
              that:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>
                The Content is yours (you own it) or you have the right to use it and grant us the rights and license as
                provided in these Terms.
              </li>
              <li>
                The posting of your Content on or through the Service does not violate the privacy rights, publicity
                rights, copyrights, contract rights or any other rights of any person.
              </li>
              <li>
                The Content does not contain false or misleading information about lost or found items, or attempt to
                defraud other users.
              </li>
            </ul>
            <p className="mb-4">
              We reserve the right to remove any Content from the Service at our discretion, without prior notice, for
              any reason, including if we believe that such Content violates these Terms.
            </p>
          </section>

          {/* Prohibited Conduct */}
          <section className="mb-8" id="conduct">
            <h2 className="mb-4 text-2xl font-bold">3. Prohibited Conduct</h2>
            <p className="mb-4">You agree not to use the Service to:</p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>
                Post false reports of lost or found items, or attempt to claim items that do not belong to you.
              </li>
              <li>
                Harass, abuse, threaten, or intimidate other users, or attempt to extort rewards or payments for
                returning found items.
              </li>
              <li>
                Post or transmit any content that is unlawful, fraudulent, threatening, abusive, libelous, defamatory,
                obscene or otherwise objectionable.
              </li>
              <li>
                Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a
                person or entity.
              </li>
              <li>
                Interfere with or disrupt the Service or servers or networks connected to the Service, or disobey any
                requirements, procedures, policies or regulations of networks connected to the Service.
              </li>
              <li>
                Collect or store personal data about other users without their express consent.
              </li>
              <li>
                Use the Service for any illegal purpose, or in violation of any local, state, national, or international
                law.
              </li>
              <li>
                Attempt to gain unauthorized access to the Service, other accounts, computer systems or networks
                connected to the Service.
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8" id="intellectual">
            <h2 className="mb-4 text-2xl font-bold">4. Intellectual Property</h2>
            <p className="mb-4">
              The Service and its original content (excluding Content provided by users), features and functionality are
              and will remain the exclusive property of FindIt and its licensors. The Service is protected by copyright,
              trademark, and other laws of both the United States and foreign countries.
            </p>
            <p className="mb-4">
              Our trademarks and trade dress may not be used in connection with any product or service without the prior
              written consent of FindIt.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-8" id="disclaimer">
            <h2 className="mb-4 text-2xl font-bold">5. Disclaimer of Warranties</h2>
            <p className="mb-4">
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
              basis. The Service is provided without warranties of any kind, whether express or implied, including, but
              not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement
              or course of performance.
            </p>
            <p className="mb-4">
              FindIt, its subsidiaries, affiliates, and its licensors do not warrant that:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>The Service will function uninterrupted, secure or available at any particular time or location.</li>
              <li>Any errors or defects will be corrected.</li>
              <li>The Service is free of viruses or other harmful components.</li>
              <li>The results of using the Service will meet your requirements.</li>
              <li>Lost items will be found or returned through use of the Service.</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8" id="limitation">
            <h2 className="mb-4 text-2xl font-bold">6. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall FindIt, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>Your access to or use of or inability to access or use the Service.</li>
              <li>Any conduct or content of any third party on the Service.</li>
              <li>Any content obtained from the Service.</li>
              <li>Unauthorized access, use or alteration of your transmissions or content.</li>
              <li>The failure to recover lost items or the misuse of found items.</li>
              <li>
                Any transactions or communications between users regarding lost and found items, including in-person
                meetings to exchange items.
              </li>
            </ul>
          </section>

          {/* Indemnification */}
          <section className="mb-8" id="indemnification">
            <h2 className="mb-4 text-2xl font-bold">7. Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify and hold harmless FindIt and its licensee and licensors, and their
              employees, contractors, agents, officers and directors, from and against any and all claims, damages,
              obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's
              fees), resulting from or arising out of:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>Your use and access of the Service.</li>
              <li>Your violation of any term of these Terms.</li>
              <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right.</li>
              <li>Any claim that your Content caused damage to a third party.</li>
              <li>Any interactions or transactions with other users regarding lost and found items.</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="mb-8" id="termination">
            <h2 className="mb-4 text-2xl font-bold">8. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="mb-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
              account, you may simply discontinue immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.

Upon termination, all provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.

</section>

{/* Governing Law */}
<section className="mb-8" id="governing">
  <h2 className="mb-4 text-2xl font-bold">9. Governing Law</h2>
  <p className="mb-4">
    These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
  </p>
  <p className="mb-4">
    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
  </p>
</section>

{/* Changes to Terms */}
<section className="mb-8" id="changes">
  <h2 className="mb-4 text-2xl font-bold">10. Changes to Terms</h2>
  <p className="mb-4">
    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
  </p>
  <p className="mb-4">
    What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
  </p>
</section>

{/* Contact Us */}
<section className="mb-8" id="contact">
  <h2 className="mb-4 text-2xl font-bold">11. Contact Us</h2>
  <p className="mb-4">
    If you have any questions about these Terms, please contact us at:
    <br />
    <a href="mailto:legal@findit.com" className="text-primary hover:underline">
      legal@findit.com
    </a>
  </p>
</section>

{/* CTA */}
<div className="mt-12 rounded-lg bg-muted p-6 text-center">
  <h2 className="text-xl font-bold">Have questions about our terms?</h2>
  <p className="mt-2 text-muted-foreground">Our team is here to help clarify any concerns.</p>
  <Button className="mt-4" asChild>
    <Link href="/contact">
      Contact Our Legal Team
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
