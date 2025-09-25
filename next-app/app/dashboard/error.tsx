"use client"
export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Dashboard Error</h2>
      <pre className="bg-muted p-3 rounded text-xs whitespace-pre-wrap">{error.message}</pre>
      <button className="underline text-sm" onClick={() => reset()}>Retry</button>
    </div>
  )
}