"use client"

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!supabase) {
        // Supabase not configured, redirect to login
        router.push('/login')
        return
      }

      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        // User is not logged in, redirect to login
        router.push('/login')
        return
      }

      // Get username from user metadata
      const username = user.user_metadata?.username || 
                      user.user_metadata?.user_name || 
                      user.user_metadata?.full_name || 
                      user.email?.split('@')[0] || 
                      'unknown'

      // Redirect to user's profile
      router.push(`/profile/${username}`)
    }

    checkUserAndRedirect()
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to your profile...</p>
        </div>
      </div>
    </div>
  )
}