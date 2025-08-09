
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface Venue {
  id: string;
  name: string;
  ownerId: string;
  status: 'Pending' | 'Published' | 'Rejected';
  type: string;
  location: string;
  images: {src: string, hint: string}[];
}

// In a real app, this would be a more robust role-based access control system.
const ADMIN_UID = "REPLACE_WITH_YOUR_ADMIN_UID";

export default function ApprovalPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.uid !== ADMIN_UID) {
      setLoading(false);
      return;
    };

    const venuesQuery = query(collection(db, "venues"), where("status", "==", "Pending"));

    const unsubscribe = onSnapshot(venuesQuery, (querySnapshot) => {
      const venuesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Venue[];
      setVenues(venuesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = async (venueId: string, newStatus: 'Published' | 'Rejected') => {
     try {
      const venueRef = doc(db, "venues", venueId);
      await updateDoc(venueRef, {
        status: newStatus,
      });
      toast({
          title: "Success!",
          description: `Venue has been ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Error updating venue status: ", error);
       toast({
        title: "Error",
        description: "Failed to update venue status.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
     return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.uid !== ADMIN_UID) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-headline">Venue Approval Queue</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pending Venues</CardTitle>
          <CardDescription>
            Review and approve or reject new venue submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                    No pending venues found.
                  </TableCell>
                </TableRow>
              ) : (
                venues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell>
                      <Image 
                        src={venue.images?.[0]?.src || "https://placehold.co/100x70.png"}
                        alt={venue.name}
                        width={100}
                        height={70}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {venue.name}
                    </TableCell>
                    <TableCell>{venue.type}</TableCell>
                    <TableCell>{venue.location}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateStatus(venue.id, "Published")}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateStatus(venue.id, "Rejected")}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
