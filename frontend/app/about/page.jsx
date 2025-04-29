import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Shield, Search, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: "Ahsan Naeem",
      role: "CEO",
      avatar: "./images1.png?height=200&width=200",
      bio: "John founded FindIt with a mission to help people reconnect with their lost belongings.",
    },
    {
      name: "Aaiza Iqbal",
      role: "CTO",
      avatar: "/placeholder.svg?height=200&width=200",
      bio: "Jane leads our technology team, building innovative solutions for lost and found management.",
    },
    {
      name: "Zoha Fatima",
      role: "COO",
      avatar: "/placeholder.svg?height=200&width=200",
      bio: "Mike ensures our community stays helpful, supportive, and engaged.",
    },
  ]

  // Features data
  const features = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Smart Matching",
      description:
        "Our advanced algorithms help match lost items with found reports, increasing the chances of recovery.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Verification",
      description:
        "Our verification system ensures that items are returned to their rightful owners through secure claim processes.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community Powered",
      description: "A supportive community of users helping each other recover lost items and return found belongings.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Location Based",
      description: "Find items near you with our location-based search and get notified of nearby matches.",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Direct Communication",
      description: "Securely communicate with other users through our built-in messaging system.",
    },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/20 to-background py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Our Mission: Reuniting People with Their Belongings
              </h1>
              <p className="mt-6 text-xl text-muted-foreground">
                FindIt is a community-driven platform dedicated to helping people recover lost items and return found
                belongings to their rightful owners.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/post">Report an Item</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/search">Find an Item</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Story</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  FindIt was born from a simple yet frustrating experience: losing a valuable item and having no
                  centralized way to find it.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  In 2020, our founder John lost his laptop at an airport. Despite visiting lost and found offices,
                  posting on social media, and putting up flyers, he never recovered it. This experience highlighted a
                  significant gap in how we handle lost and found items.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  Determined to solve this problem, John assembled a team of technology and community experts to create
                  FindIt — a platform that combines advanced technology with the power of community to help people
                  recover what matters to them.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  Today, FindIt has helped thousands of people recover their lost items and continues to grow as a
                  trusted platform for lost and found management.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-[80%] w-[80%] rounded-lg bg-primary/10"></div>
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Our Story"
                  className="relative z-10 rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What Makes Us Different</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                FindIt combines technology and community to create the most effective lost and found platform.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 rounded-lg border bg-card p-8 shadow-sm md:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary md:text-5xl">15,000+</div>
                <div className="mt-2 text-lg font-medium">Items Recovered</div>
                <p className="mt-1 text-sm text-muted-foreground">Successfully returned to their owners</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary md:text-5xl">50,000+</div>
                <div className="mt-2 text-lg font-medium">Active Users</div>
                <p className="mt-1 text-sm text-muted-foreground">Helping find and return lost items</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary md:text-5xl">200+</div>
                <div className="mt-2 text-lg font-medium">Cities Covered</div>
                <p className="mt-1 text-sm text-muted-foreground">And growing every month</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Meet Our Team</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The passionate people behind FindIt who are dedicated to helping you find what matters.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Success Stories</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Hear from people who have successfully recovered their lost items through FindIt.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Emily R." />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Emily R.</div>
                      <div className="text-sm text-muted-foreground">New York, NY</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "I lost my engagement ring at a beach and was devastated. Within 24 hours of posting on FindIt,
                    someone had found it! The platform made it easy to connect and verify it was mine. I'm so grateful!"
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Marcus T." />
                      <AvatarFallback>MT</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Marcus T.</div>
                      <div className="text-sm text-muted-foreground">Chicago, IL</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "I found a wallet with important documents and wanted to return it to the owner. FindIt made the
                    process simple and secure. The owner was incredibly relieved, and it felt great to help."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sophia L." />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Sophia L.</div>
                      <div className="text-sm text-muted-foreground">San Francisco, CA</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "My laptop was left in a rideshare, and I thought it was gone forever. Thanks to FindIt's location
                    matching, I connected with the driver who had found it. The verification process gave us both peace
                    of mind."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="rounded-lg bg-primary p-8 text-primary-foreground md:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Join Our Community Today</h2>
                <p className="mt-4 text-lg">
                  Whether you've lost something valuable or found an item that needs to be returned, FindIt is here to
                  help.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/post">
                      Report an Item
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/search">Browse Items</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Values</h2>
                <ul className="mt-8 space-y-6">
                  <li className="flex items-start gap-4">
                    <CheckCircle className="mt-1 h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-medium">Community First</h3>
                      <p className="mt-2 text-muted-foreground">
                        We believe in the power of community to help each other in times of need.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="mt-1 h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-medium">Trust & Security</h3>
                      <p className="mt-2 text-muted-foreground">
                        We prioritize creating a safe platform where users can trust the process.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="mt-1 h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-medium">Accessibility</h3>
                      <p className="mt-2 text-muted-foreground">
                        Our platform is designed to be accessible to everyone, regardless of technical ability.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="mt-1 h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-medium">Innovation</h3>
                      <p className="mt-2 text-muted-foreground">
                        We continuously improve our technology to increase the chances of successful recoveries.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Our Values"
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
