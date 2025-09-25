"use client"
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

async function getSnippetCount() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/snippets`, { cache: 'no-store' })
    if (!res.ok) return 0
    const data = await res.json()
    return Array.isArray(data.items) ? data.items.length : 0
  } catch {
    return 0
  }
}

export async function OverviewStats() {
  const snippetCount = await getSnippetCount()
  const stats = [
    { label: 'Revenue', value: '$0', note: 'Stub' },
    { label: 'Orders', value: '0', note: 'Stub' },
    { label: 'Snippets', value: String(snippetCount), note: 'Mock data' },
    { label: 'Users', value: '0', note: 'Stub' }
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(s => (
        <Card key={s.label}>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{s.label}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{s.value}<span className="block text-xs font-normal text-muted-foreground mt-1">{s.note}</span></CardContent>
        </Card>
      ))}
    </div>
  )
}
