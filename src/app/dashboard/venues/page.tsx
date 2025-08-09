
"use client";

import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Bot, View, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { venues as myVenues } from "@/lib/data"; // Using seed data for now

// A simple hardcoded check for admin UID. 
// In a real app, this would be a more robust role-based access control system.
const ADMIN_UID = "REPLACE_WITH_YOUR_ADMIN_UID"; 

export default function MyVenuesPage() {
  const { user } = useAuth();
  const isAdmin = user && user.uid === ADMIN_UID;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline">My Venues</h1>
          <p className="text-muted-foreground">Manage your property listings.</p>
        </div>
        <div className="flex gap-2">
           {isAdmin && (
            <Button asChild variant="secondary">
              <Link href="/dashboard/venues/approval">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Approval List
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/dashboard/venues/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Venue
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-6">
        {myVenues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden">
            <div className="flex flex-col items-start gap-6 p-6 md:flex-row">
              <Image
                src={venue.image}
                alt={venue.name}
                width={200}
                height={130}
                className="w-full rounded-md object-cover md:w-[200px]"
                data-ai-hint={venue.hint}
              />
              <div className="flex-1">
                <CardHeader className="p-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-headline text-2xl">
                        {venue.name}
                      </CardTitle>
                      <CardDescription>
                        {venue.location} - {venue.type}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        venue.status === "Published" ? "default" : venue.status === 'Pending' ? 'secondary' : 'destructive'
                      }
                      className={venue.status === "Published" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {venue.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="gap-2 p-0 pt-4">
                  <Button asChild size="sm">
                    <Link href={`/dashboard/venues/${venue.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/venues/${venue.id}/pricing-assistant`}>
                      <Bot className="mr-2 h-4 w-4" /> AI Pricing
                    </Link>
                  </Button>
                  {venue.status === 'Published' && (
                     <Button asChild size="sm" variant="ghost">
                        <Link href={`/venues/${venue.id}`}>
                          <View className="mr-2 h-4 w-4" /> View Listing
                        </Link>
                      </Button>
                  )}
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
