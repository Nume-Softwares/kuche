import { SearchCommand } from '@/components/auth/search-command'
import { ModeToggle } from '@/components/themes/mode-toggle'

export default function DashboardPage() {
  return (
    <div>
      Dashborad Page <ModeToggle />
      <SearchCommand />
    </div>
  )
}
