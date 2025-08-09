
'use client'

import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Building2, LayoutDashboard, Settings, CalendarCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'owner')) {
      router.push('/login/owner');
    }
  }, [user, loading, router]);
  
  if (loading || !user || user.role !== 'owner') {
      return null; // Or a loading spinner
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar className="hidden border-r md:flex">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild variant="ghost">
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild variant="ghost">
                    <Link href="/dashboard/venues">
                      <Building2 />
                      My Venues
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild variant="ghost">
                    <Link href="/dashboard/bookings">
                      <CalendarCheck />
                      My Bookings
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild variant="ghost">
                    <Link href="/dashboard/settings">
                      <Settings />
                      Settings
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 bg-secondary/30 p-6 md:p-10">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
