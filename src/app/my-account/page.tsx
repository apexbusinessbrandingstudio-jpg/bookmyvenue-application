
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type BookingStatus = "Pending" | "Approved" | "Rejected";

interface Booking {
  id: string;
  venueName: string;
  date: string;
  guests: number;
  status: BookingStatus;
  venueId: number;
  totalAmount: number;
  bookingSession: string;
}

export default function MyAccountPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const bookingsQuery = query(collection(db, "bookings"), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                venueName: data.venueName,
                date: (data.date as Timestamp).toDate().toLocaleDateString(),
                guests: data.guests,
                status: data.status,
                venueId: data.venueId,
                totalAmount: data.totalAmount,
                bookingSession: data.bookingSession,
            } as Booking;
        });
        setBookings(bookingsData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
      <h1 className="text-4xl font-bold font-headline">My Bookings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Booking History</CardTitle>
          <CardDescription>
            Here are all the bookings you've made.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                    You haven't made any bookings yet.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      <Link href={`/venues/${booking.venueId}`} className="hover:underline">
                        {booking.venueName}
                      </Link>
                    </TableCell>
                    <TableCell>{booking.date}</TableCell>
                     <TableCell className="capitalize">{booking.bookingSession}</TableCell>
                     <TableCell>₹{booking.totalAmount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "Approved"
                            ? "default"
                            : booking.status === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                         className={
                          booking.status === "Approved"
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button asChild variant="outline" size="sm">
                          <Link href={`/venues/${booking.venueId}`}>
                            View Venue
                          </Link>
                        </Button>
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

