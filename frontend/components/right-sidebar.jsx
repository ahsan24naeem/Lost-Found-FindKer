import Link from "next/link"

export default function RightSidebar({ className }) {
  return (
    <aside className={`w-80 border-l p-4 ${className}`}>
      <div className="space-y-6">
        {/* Footer */}
        <div className="text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/cookies" className="hover:underline">
              Cookies
            </Link>
            <Link href="/help" className="hover:underline">
              Help
            </Link>
          </div>
          <div className="mt-2">© {new Date().getFullYear()} FindKer. All rights reserved.</div>
        </div>
      </div>
    </aside>
  )
}
