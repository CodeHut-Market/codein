"use client"

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { BookOpen, Code, DollarSign, Heart, Home, LogOut, Menu, Play, Search, Upload, User, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isSupabaseEnabled, supabase } from '../app/lib/supabaseClient';
import RippleThemeToggle from './RippleThemeToggle';

interface NavigationProps {
  className?: string
}

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Demo', href: '/demo', icon: Play },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
  { name: 'Docs', href: '/docs', icon: BookOpen },
  { name: 'Community', href: '/community', icon: Users },
]

export default function Navigation({ className }: NavigationProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (isSupabaseEnabled()) {
      // Get initial session
      supabase!.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      // Listen for auth changes
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
  }, [])

  const handleSignOut = async () => {
    if (isSupabaseEnabled()) {
      await supabase!.auth.signOut()
    }
    setUser(null)
  }

  const getUserInitials = (user: SupabaseUser) => {
    const name = user.user_metadata?.full_name || user.email
    return name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
  }

  const getUserDisplayName = (user: SupabaseUser) => {
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  }

  return (
    <nav className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Code className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              CodeHut
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Ripple Theme Toggle */}
            <RippleThemeToggle size="md" />

            {/* User Menu or Sign In */}
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                  onClick={() => {/* Add dropdown logic here if needed */}}
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {getUserInitials(user)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {getUserDisplayName(user)}
                  </span>
                </button>
                {/* You can add a dropdown menu here if needed */}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <button className="px-4 py-2 text-sm font-medium border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                )
              })}
              
              {/* Auth section for mobile */}
              {!user && (
                <div className="border-t border-border mt-3 pt-3 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full px-3 py-2 text-sm font-medium border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full px-3 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
              
              {user && (
                <>
                  <div className="border-t border-border mt-3 pt-3">
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}