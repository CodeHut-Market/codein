'use client'

import { useEffect } from 'react';

export default function SnippetDetailError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Snippet detail route error:', error)
  }, [error])

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Failed to load snippet.</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition"
      >
        Retry
      </button>
    </div>
  )
}