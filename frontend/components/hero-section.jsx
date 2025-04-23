import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary/20 to-background py-16 md:py-24">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Lost Something? <br />
              <span className="text-primary">FindKer</span> is Here.
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              A centralized platform where you can report lost items, find recovered items, and connect with your
              community to get your belongings back.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/lost">Browse Lost Items</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/found">Browse Found Items</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px]">
              <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 sm:h-[350px] sm:w-[350px] md:h-[450px] md:w-[450px]"></div>
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Lost and Found"
                className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-lg object-cover shadow-lg sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
