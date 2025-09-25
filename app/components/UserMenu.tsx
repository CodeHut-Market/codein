"use client";
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface UserMenuProps {
  username?: string;
}

// Placeholder user menu to be replaced with real auth integration
export function UserMenu({ username = 'demo-user' }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
          {username.charAt(0).toUpperCase()}
        </span>
        <span className="hidden md:inline text-sm font-medium max-w-[90px] truncate">{username}</span>
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-md border bg-popover shadow-md focus:outline-none z-50 p-1 text-sm"
        >
          <Link
            href="/profile"
            role="menuitem"
            className="flex items-center gap-2 rounded-sm px-2 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4" /> Profile
          </Link>
          <Link
            href="/settings"
            role="menuitem"
            className="flex items-center gap-2 rounded-sm px-2 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            role="menuitem"
            className="w-full text-left flex items-center gap-2 rounded-sm px-2 py-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
            onClick={() => {
              // placeholder logout
              setOpen(false);
              console.info('Logout clicked (placeholder)');
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;