"use client"

import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { isSupabaseEnabled, supabase } from '../lib/supabaseClient'

export default function DashboardTestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (isSupabaseEnabled()) {
        supabase!.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null)
          setIsLoading(false)
        }).catch((err) => {
          console.error('Auth session error:', err)
          setError(err.message)
          setIsLoading(false)
        })

        const {
          data: { subscription },
        } = supabase!.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null)
          setIsLoading(false)
        })

        return () => subscription.unsubscribe()
      } else {
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Dashboard initialization error:', err)
      setError(err.message)
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Dashboard Error</CardTitle>
            <CardDescription>
              An error occurred while initializing the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-600 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>
              Please sign in to view your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
          <p className="text-muted-foreground">Dashboard is working correctly</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Test Card 1</CardTitle>
              <CardDescription>This is a test card</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The basic dashboard structure is working.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Card 2</CardTitle>
              <CardDescription>Another test card</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Authentication is working properly.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Card 3</CardTitle>
              <CardDescription>Final test card</CardDescription>
            </CardHeader>
            <CardContent>
              <p>All basic components are loading correctly.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}