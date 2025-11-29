/**
 * FILE-REF: COMP-060-20251128
 *
 * @file Header.tsx
 * @description Main header component with navigation and version badge
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Added version badge display (CHG-009)
 * - 2025-11-28 - Initial header component (CHG-004)
 *
 * @dependencies
 * - next/link
 * - lucide-react
 *
 * @see Related files:
 * - COMP-083 (VersionBadge.tsx)
 * - COMP-061 (MobileNav.tsx)
 * - PAGE-000 (layout.tsx)
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Activity, FolderKanban, Server, List, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";
import { VersionBadge } from "@/components/layout/VersionBadge";

const navigation = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Resources", href: "/resources", icon: Server },
  { name: "Changelog", href: "/changelog", icon: List },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              DevOps Dashboard
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Version Badge - Always visible */}
        <div className="ml-auto flex items-center gap-2">
          <VersionBadge />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container flex flex-col space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t mt-4 flex items-center justify-between px-3">
              <span className="text-xs text-muted-foreground">Version</span>
              <VersionBadge />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
