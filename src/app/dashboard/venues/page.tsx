
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
import { Plus, Edit, Bot, View, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// A simple hardcoded check for admin UID. 
// In a real app, this would be a more robust role-based access control system.
const ADMIN_UID = "REPLACE_WITH_YOUR_ADMIN_UID"; 

interface Venue {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'Published' | 'Pending' | 'Rejected';
  images: { src: string, hint: string }[];
}

export default function MyVenuesPage() {
  const { user } = useAuth();
  const isAdmin = user && user.uid === ADMIN_UID;
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };

    // Query venues owned by the current user
    const venuesQuery = query(collection(db, "venues"), where("ownerId", "==", user.uid));
    
    const unsubscribe = onSnapshot(venuesQuery, (querySnapshot) => {
        const userVenues = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Venue[];
        setVenues(userVenues);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);


  if (loading) {
    return (
     <div className="flex items-center justify-center h-full">
       <Loader2 className="h-8 w-8 animate-spin" />
     </div>
   );
 }

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
        {venues.length === 0 ? (
             <Card className="flex flex-col items-center justify-center p-12 text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">No Venues Found</CardTitle>
                    <CardDescription>
                        You haven't listed any properties yet.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/dashboard/venues/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Your First Venue
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        ) : (
            venues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden">
                <div className="flex flex-col items-start gap-6 p-6 md:flex-row">
                <Image
                    src={venue.images?.[0]?.src || "https://placehold.co/200x130.png"}
                    alt={venue.name}
                    width={200}
                    height={130}
                    className="w-full rounded-md object-cover md:w-[200px]"
                    data-ai-hint={venue.images?.[0]?.hint}
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
            ))
        )}
      </div>
    </div>
  );
}

