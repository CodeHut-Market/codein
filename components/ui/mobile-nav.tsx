"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    BookOpen,
    ChevronRight,
    Code2,
    Heart,
    Home,
    LogOut,
    Mail,
    Menu,
    Search,
    Settings,
    Star,
    User,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Search,
    children: [
      { title: "Code Snippets", href: "/explore/snippets", icon: Code2 },
      { title: "Templates", href: "/explore/templates", icon: BookOpen },
      { title: "Popular", href: "/explore/popular", icon: Star },
    ],
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: User,
  },
  {
    title: "Favorites",
    href: "/favorites",
    icon: Heart,
    badge: "5",
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: BookOpen,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
  },
];

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MobileNav({ isOpen, onToggle, className }: MobileNavProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleItemClick = () => {
    onToggle();
    setExpandedItems([]);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              mass: 0.8
            }}
            className={cn(
              "fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background border-r shadow-xl z-50 lg:hidden",
              "safe-area-left safe-area-top",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">CodeHut</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="p-2 h-auto w-auto rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto py-6">
              <ul className="space-y-2 px-4">
                {navigationItems.map((item, index) => (
                  <NavItemComponent
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    expandedItems={expandedItems}
                    onToggleExpanded={toggleExpanded}
                    onItemClick={handleItemClick}
                    index={index}
                  />
                ))}
              </ul>

              {/* User Section */}
              <div className="mt-8 px-4 pt-6 border-t">
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    onClick={handleItemClick}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <User className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={handleItemClick}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                  <button className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/20">
              <p className="text-xs text-muted-foreground text-center">
                © 2024 CodeHut. Made with ❤️
              </p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  pathname: string;
  expandedItems: string[];
  onToggleExpanded: (title: string) => void;
  onItemClick: () => void;
  index: number;
}

function NavItemComponent({
  item,
  pathname,
  expandedItems,
  onToggleExpanded,
  onItemClick,
  index
}: NavItemComponentProps) {
  const isActive = pathname === item.href;
  const isExpanded = expandedItems.includes(item.title);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {hasChildren ? (
        <>
          <button
            onClick={() => onToggleExpanded(item.title)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors",
              "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
              isActive && "bg-primary/10 text-primary"
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.title}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-8 mt-1 space-y-1 overflow-hidden"
              >
                {item.children.map((child, childIndex) => (
                  <motion.li
                    key={child.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: childIndex * 0.05 }}
                  >
                    <Link
                      href={child.href}
                      onClick={onItemClick}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                        "hover:bg-muted/50 focus:bg-muted/50",
                        pathname === child.href && "bg-primary/10 text-primary"
                      )}
                    >
                      <child.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{child.title}</span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.href}
          onClick={onItemClick}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            "hover:bg-muted/50 focus:bg-muted/50",
            isActive && "bg-primary/10 text-primary"
          )}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{item.title}</span>
          {item.badge && (
            <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full ml-auto">
              {item.badge}
            </span>
          )}
        </Link>
      )}
    </motion.li>
  );
}

// Mobile Navigation Toggle Button
export function MobileNavToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden p-2 h-auto w-auto rounded-lg hover:bg-muted/50 transition-colors"
      onClick={onToggle}
      aria-label="Toggle mobile navigation"
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </motion.div>
    </Button>
  );
}