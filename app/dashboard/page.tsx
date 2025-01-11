import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EmployerDashboard } from '@/components/dashboard/employer-dashboard'
import { EmployeeDashboard } from '@/components/dashboard/employee-dashboard'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/signin')
  }

  // Fetch user profile to determine user type
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="container mx-auto py-10">
      {profile?.user_type === 'employer' ? (
        <EmployerDashboard userId={session.user.id} />
      ) : (
        <EmployeeDashboard userId={session.user.id} />
      )}
    </div>
  )
}

