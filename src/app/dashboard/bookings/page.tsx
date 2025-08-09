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
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, onSnapshot, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

type BookingStatus = "Pending" | "Approved" | "Rejected";

interface Booking {
  id: string;
  venueName: string;
  customerName: string;
  date: string;
  guests: number;
  status: BookingStatus;
}


export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Assuming you have ownerId on venues to filter

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };

    // In a real app, you'd likely query venues where ownerId === user.uid
    // and then query bookings for those venueIds.
    // For this example, we'll fetch all bookings.
    const bookingsQuery = query(collection(db, "bookings"));

    const unsubscribe = onSnapshot(bookingsQuery, (querySnapshot) => {
      const bookingsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          venueName: data.venueName,
          customerName: data.customerName,
          date: (data.date as Timestamp).toDate().toLocaleDateString(),
          guests: data.guests,
          status: data.status,
        } as Booking;
      });
      setBookings(bookingsData);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [user]);

  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
     try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
      });
      // The onSnapshot listener will automatically update the UI
    } catch (error) {
      console.error("Error updating booking status: ", error);
      // Optionally show a toast notification on error
    }
  };

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
          <CardTitle className="font-headline">Booking Requests</CardTitle>
          <CardDescription>
            Manage booking requests for your venues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No booking requests found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.venueName}
                    </TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell className="text-center">
                      {booking.guests}
                    </TableCell>
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
                      {booking.status === "Pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateStatus(booking.id, "Approved")}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateStatus(booking.id, "Rejected")}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </div>
                      )}
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
