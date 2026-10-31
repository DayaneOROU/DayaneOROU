// app/dayane/dashboard/page.tsx
import { getProjects } from '@/lib/actions/projects'

export default async function DashboardPage() {
  const projects = await getProjects()

  return (
    <div className='admin-padding'>
        cc
    </div>
  )
}