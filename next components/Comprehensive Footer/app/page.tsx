import { FooterComprehensive } from "@/components/footer-comprehensive"

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">CodeHut Footer</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Professional footer design for your code marketplace website.
          </p>
        </div>
      </main>

      <FooterComprehensive />
    </div>
  )
}
