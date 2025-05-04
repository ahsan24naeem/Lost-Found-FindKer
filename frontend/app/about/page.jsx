import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Shield, Search, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: "Ahsan Naeem",
      role: "CEO",
      avatar: "/ahsan.jpg?height=200&width=200",
      bio: "Ahsan founded FindKer with a mission to help people reconnect with their lost belongings.",
    },
    {
      name: "Aaiza Iqbal",
      role: "CTO",
      avatar: "/aaiza.jpg?height=200&width=200",
      bio: "Aaiza leads our technology team, building innovative solutions for lost and found management.",
    },
    {
      name: "Zoha Fatima",
      role: "COO",
      avatar: "/zoha.jpg?height=200&width=200",
      bio: "Zoha ensures our community stays helpful, supportive, and engaged.",
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
                FindKer is a community-driven platform dedicated to helping people recover lost items and return found
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
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Story</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                FindKer was born from a simple yet frustrating experience: losing a valuable item and having no
                centralized way to find it.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                In 2020, our founder Mr. Ahsan lost his laptop at an airport. Despite visiting lost and found offices,
                posting on social media, and putting up flyers, he never recovered it. This experience highlighted a
                significant gap in how we handle lost and found items.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Determined to solve this problem, Mr. Ahsan assembled a team of technology and community experts to create
                FindIt — a platform that combines advanced technology with the power of community to help people
                recover what matters to them.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Today, FindKer has helped thousands of people recover their lost items and continues to grow as a
                trusted platform for lost and found management.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What Makes Us Different</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                FindKer combines technology and community to create the most effective lost and found platform.
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
                <div className="text-4xl font-bold text-primary md:text-5xl">10+</div>
                <div className="mt-2 text-lg font-medium">Items Recovered</div>
                <p className="mt-1 text-sm text-muted-foreground">Successfully returned to their owners</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary md:text-5xl">10+</div>
                <div className="mt-2 text-lg font-medium">Active Users</div>
                <p className="mt-1 text-sm text-muted-foreground">Helping find and return lost items</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary md:text-5xl">10+</div>
                <div className="mt-2 text-lg font-medium">Positive Reviews</div>
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
                The passionate people behind FindKer who are dedicated to helping you find what matters.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden flex flex-col items-center">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Values</h2>
              <ul className="mt-8 space-y-6 w-full">
                <li className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-medium">Community First</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground max-w-md">
                    We believe in the power of community to help each other in times of need.
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-medium">Trust & Security</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground max-w-md">
                    We prioritize creating a safe platform where users can trust the process.
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-medium">Accessibility</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground max-w-md">
                    Our platform is designed to be accessible to everyone, regardless of technical ability.
                  </p>
                </li>
                <li className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-medium">Innovation</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground max-w-md">
                    We continuously improve our technology to increase the chances of successful recoveries.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}