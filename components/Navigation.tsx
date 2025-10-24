"use client"

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { BookOpen, ChevronDown, Code, Heart, Home, LogOut, Menu, Play, Search, Settings, Upload, User, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isSupabaseEnabled, supabase } from '../app/lib/supabaseClient';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../client/components/ui/dropdown-menu';
import ThemeSwitcher from '../app/components/ThemeSwitcher';

interface NavigationProps {
  className?: string
}

const navItems = [
  { name: 'Home', href: '/', icon: Home, color: 'text-emerald-600 hover:text-emerald-700' },
  { name: 'Explore', href: '/explore', icon: Search, color: 'text-cyan-600 hover:text-cyan-700' },
  { name: 'Upload', href: '/upload', icon: Upload, color: 'text-violet-600 hover:text-violet-700' },
  { name: 'Favorites', href: '/favorites', icon: Heart, color: 'text-rose-600 hover:text-rose-700' },
  { name: 'Demo', href: '/demo', icon: Play, color: 'text-amber-600 hover:text-amber-700' },
  { name: 'Docs', href: '/docs', icon: BookOpen, color: 'text-teal-600 hover:text-teal-700' },
  { name: 'Community', href: '/community', icon: Users, color: 'text-orange-600 hover:text-orange-700' },
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
    <nav className={`bg-white dark:bg-gray-900 border-b border-border sticky top-0 z-40 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-all duration-200 group">
            <Code className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-indigo-700 group-hover:to-purple-700 transition-all duration-200">
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
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-800/50'
                      : `text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800/50 dark:hover:to-slate-800/50 hover:shadow-sm hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50 ${item.color}`
                  }`}
                >
                  <item.icon className={`h-4 w-4 transition-all duration-200 ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : `text-gray-500 dark:text-gray-400 group-hover:${item.color.split(' ')[0].replace('text-', 'text-')} dark:group-hover:${item.color.split(' ')[0].replace('text-', 'text-')}`
                  }`} />
                  <span className="relative">
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-80" />
                    )}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Switcher Dropdown */}
            <ThemeSwitcher />

            {/* User Menu or Sign In */}
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gradient-to-r hover:from-emerald-50 hover:to-cyan-50 dark:hover:from-emerald-900/20 dark:hover:to-cyan-900/20 transition-all duration-200 hover:shadow-sm hover:border hover:border-emerald-200/50 dark:hover:border-emerald-700/50 group">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 flex items-center justify-center text-white text-sm font-medium shadow-lg group-hover:shadow-xl transition-all duration-200 hover:scale-105">
                      {getUserInitials(user)}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                      {getUserDisplayName(user)}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 text-gray-500 dark:text-gray-400 group-hover:opacity-70 transition-all duration-200" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName(user)}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <button className="px-5 py-2.5 text-sm font-medium border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-all duration-200 hover:shadow-sm">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800/50 dark:hover:to-slate-800/50 transition-all duration-200 hover:shadow-sm hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50"
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
          <>
            {/* Mobile Menu Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Mobile Menu Panel */}
            <div className="absolute top-full left-0 right-0 bg-background border-t border-border shadow-xl z-60 md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800/50 dark:hover:to-slate-800/50 hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`h-5 w-5 ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                )
              })}
              
              {/* Auth section for mobile */}
              {!user && (
                <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full px-4 py-3 text-sm font-medium border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-all duration-200">
                      Sign In
                    </button>
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="w-full px-4 py-3 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 hover:shadow-md">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
              
              {user && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800/50 dark:hover:to-slate-800/50 transition-all duration-200 hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800/50 dark:hover:to-slate-800/50 transition-all duration-200 hover:border hover:border-gray-200/50 dark:hover:border-gray-700/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span>Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/30 dark:hover:to-pink-950/30 transition-all duration-200 hover:border hover:border-red-200/50 dark:hover:border-red-800/50"
                    >
                      <div className="flex items-center space-x-3">
                        <LogOut className="h-5 w-5" />
                        <span>Sign out</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}