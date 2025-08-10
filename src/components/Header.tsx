
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "./Logo";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <UserNav />
            {user?.role === 'owner' && (
               <Button variant="outline" asChild>
                <Link href="/dashboard">Owner Dashboard</Link>
              </Button>
            )}
             {user?.role === 'customer' && (
               <Button variant="outline" asChild>
                <Link href="/my-account">My Bookings</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
