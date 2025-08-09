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
import { Check, X } from "lucide-react";

const bookings = [
  {
    id: 1,
    venueName: "The Grand Meadow",
    customerName: "Alice Johnson",
    date: "2024-09-15",
    guests: 150,
    status: "Pending",
  },
  {
    id: 2,
    venueName: "The Grand Meadow",
    customerName: "Bob Williams",
    date: "2024-10-20",
    guests: 100,
    status: "Approved",
  },
  {
    id: 3,
    venueName: "My New Hall",
    customerName: "Charlie Brown",
    date: "2024-11-01",
    guests: 200,
    status: "Rejected",
  },
  {
    id: 4,
    venueName: "The Grand Meadow",
    customerName: "Diana Prince",
    date: "2024-11-12",
    guests: 180,
    status: "Pending",
  },
];

export default function BookingsPage() {
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
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.venueName}
                  </TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell className="text-center">{booking.guests}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "Approved"
                          ? "default"
                          : booking.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={booking.status === "Approved" ? "bg-primary text-primary-foreground" : ""}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === "Pending" && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}