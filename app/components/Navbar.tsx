"use client";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { NAV_ITEMS } from "../config/navigation";
import NotificationsMenu from "./NotificationsMenu";
import UserMenu from "./UserMenu";

// Using AuthContext

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const [unread, setUnread] = useState(0);
  useEffect(()=>{
    // fetch notifications to compute unread badge
    fetch('/api/notifications', { cache: 'no-store'}).then(r=> r.json()).then(d=> {
      const list = d.notifications || [];
      setUnread(list.filter((n:any)=> !n.read).length);
    }).catch(()=>{});
  },[]);

  // Filter navigation based on auth flags
  const navItems = useMemo(
    () => NAV_ITEMS.filter(i => (i.authOnly ? !!user : true)),
    [user]
  );

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Brand text (logo removed per request) */}
          <Link href="/" className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Marketplace
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium relative" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "relative px-0.5 transition-colors after:absolute after:left-0 after:bottom-[-6px] after:h-0.5 after:bg-primary after:rounded-full after:transition-all after:duration-300 " +
                    (active
                      ? "text-foreground after:w-full"
                      : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full after:bg-primary/60")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <NotificationsMenu />
            <Bell className="absolute -right-2 -top-2 h-4 w-4 text-muted-foreground" />
            {unread > 0 && <span className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center text-[10px] font-medium">{unread}</span>}
          </div>
          <ThemeToggle />
          {user ? (
            <div className="hidden sm:flex">
              <UserMenu username={user.email || 'user'} />
            </div>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background">
          <nav className="px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={
                    "text-sm font-medium transition-colors " +
                    (active ? "text-foreground" : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            {!user && !loading && (
              <div className="flex gap-2 pt-2">
                <Button asChild className="flex-1" size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1" size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;