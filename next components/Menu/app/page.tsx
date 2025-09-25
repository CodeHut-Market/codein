import { MenuBar } from "@/components/menu-bar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-[120px]">
        <ThemeToggle />
      </div>
      <MenuBar />
    </div>
  )
}
