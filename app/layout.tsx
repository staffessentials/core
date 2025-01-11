import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { Navigation } from '@/components/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StaffEssentials',
  description: 'Your one-stop platform for managing staff and gig work efficiently',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation session={session} />
        {children}
        <Toaster />
      </body>
    </html>
  )
}

