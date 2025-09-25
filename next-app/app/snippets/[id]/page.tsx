interface SnippetPageProps { params: { id: string } }

export default function SnippetDetailPage({ params }: SnippetPageProps) {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Snippet {params.id}</h1>
      <p className="text-muted-foreground">Detailed snippet view migration pending.</p>
    </main>
  )
}
