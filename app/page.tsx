import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full items-center justify-between text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to StaffEssentials</h1>
        <p className="text-xl text-center mb-8">
          Your one-stop platform for managing staff and gig work efficiently
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/gigs">
            <Button size="lg" variant="outline">
              Browse Gigs
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

