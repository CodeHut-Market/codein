import { SearchFilterBar } from "@/components/search-filter-bar"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Code Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and purchase high-quality code snippets, templates, and projects
          </p>
        </div>

        <SearchFilterBar />

        <div className="mt-8 text-center text-muted-foreground">
          <p>Search results will appear here...</p>
        </div>
      </div>
    </main>
  )
}
