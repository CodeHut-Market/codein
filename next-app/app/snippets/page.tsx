import Link from 'next/link'
import { Suspense } from 'react'

async function fetchSnippets() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/snippets`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load snippets')
  return res.json() as Promise<{ items: { id: string; title: string; price: number }[] }>
}

async function SnippetList() {
  const data = await fetchSnippets()
  return (
    <ul className="space-y-3">
      {data.items.map(s => (
        <li key={s.id} className="border rounded p-3 flex items-center justify-between">
          <div>
            <Link className="font-medium hover:underline" href={`/snippets/${s.id}`}>{s.title}</Link>
            <p className="text-xs text-muted-foreground">${'{'}s.price{'}'} {s.price ? 'USD' : 'Free'}</p>
          </div>
          <span className="text-sm text-muted-foreground">ID: {s.id}</span>
        </li>
      ))}
    </ul>
  )
}

export default function SnippetsPage() {
  return (
    <main className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Snippets</h1>
        <p className="text-muted-foreground">Sample list (mock data; will migrate to Supabase)</p>
      </div>
      <Suspense fallback={<div>Loading snippets...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <SnippetList />
      </Suspense>
    </main>
  )
}
