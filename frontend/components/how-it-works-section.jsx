import { ArrowRight, MapPin, Search, UserCheck } from "lucide-react"

export default function HowItWorksSection() {
  return (
    <section className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
        <p className="mt-4 text-muted-foreground">
          Our platform makes it easy to report and find lost items in just a few simple steps
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Report an Item</h3>
          <p className="mt-2 text-muted-foreground">
            Report a lost or found item with details, location, and photos to help with identification.
          </p>
          <div className="mt-4 flex items-center text-primary">
            <span className="text-sm font-medium">Learn more</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Search & Match</h3>
          <p className="mt-2 text-muted-foreground">
            Browse listings or get notified when a potential match for your lost item is found.
          </p>
          <div className="mt-4 flex items-center text-primary">
            <span className="text-sm font-medium">Learn more</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Verify & Claim</h3>
          <p className="mt-2 text-muted-foreground">
            Verify ownership through our secure claim system and arrange to retrieve your item.
          </p>
          <div className="mt-4 flex items-center text-primary">
            <span className="text-sm font-medium">Learn more</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  )
}
