export default function StatsSection() {
  return (
    <section className="border-y bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold md:text-4xl">5,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Items Found</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold md:text-4xl">10,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Items Reported</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold md:text-4xl">3,500+</div>
            <div className="mt-2 text-sm text-muted-foreground">Items Returned</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold md:text-4xl">15,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Happy Users</div>
          </div>
        </div>
      </div>
    </section>
  )
}
