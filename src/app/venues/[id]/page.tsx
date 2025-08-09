
"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  MapPin,
  Users,
  Wifi,
  ParkingSquare,
  UtensilsCrossed,
  CheckCircle,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createBooking, type State } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";


const venue = {
  id: 1,
  name: "The Grand Meadow",
  type: "Farmhouse",
  location: "Sunnyvale, CA",
  capacity: 200,
  price: 1500,
  images: [
    {
      src: "https://placehold.co/1200x800.png",
      hint: "farmhouse field",
    },
    {
      src: "https://placehold.co/1200x800.png",
      hint: "farmhouse interior",
    },
    {
      src: "https://placehold.co/1200x800.png",
      hint: "farmhouse garden",
    },
  ],
  description:
    "A beautiful farmhouse set in acres of lush green meadows, perfect for weddings and corporate retreats. The Grand Meadow offers a serene escape from the city with modern amenities and breathtaking views.",
  amenities: [
    { name: "Free Wi-Fi", icon: Wifi },
    { name: "On-site Parking", icon: ParkingSquare },
    { name: "Catering Available", icon: UtensilsCrossed },
    { name: "Outdoor Space", icon: CheckCircle },
  ],
  owner: {
    name: "Jane Doe",
    email: "jane.doe@grandmeadow.com",
    phone: "+1 (555) 123-4567",
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      size="lg"
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Sending..." : "Send Booking Request"}
    </Button>
  );
}

export default function VenueDetailPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);
  const { user } = useAuth();
  
  const initialState: State = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(createBooking, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const createBookingWithAuth = dispatch.bind(null, user ? { ...initialState, userId: user.uid } : initialState);

  React.useEffect(() => {
    async function fetchBookedDates() {
      if (!venue.id) return;
      
      const q = query(collection(db, "bookings"), where("venueId", "==", venue.id), where("status", "in", ["Approved", "Pending"]));
      const querySnapshot = await getDocs(q);
      const dates = querySnapshot.docs.map(doc => (doc.data().date as Timestamp).toDate());
      setBookedDates(dates);
    }
    fetchBookedDates();
  }, [venue.id]);


  const handlePayment = () => {
    const options = {
      key: "rzp_test_your_key_id", // Replace with your Test Key ID
      amount: venue.price * 100, // Amount in paise
      currency: "INR",
      name: "BOOKMYVENUE",
      description: `Booking for ${venue.name}`,
      image: "https://example.com/your_logo.svg", // A URL to your logo
      handler: function (response: any) {
        toast({
          title: "Payment Successful!",
          description: `Payment ID: ${response.razorpay_payment_id}`,
        });
      },
      prefill: {
        name: user?.displayName || "Test User",
        email: user?.email || "test.user@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Test Address",
      },
      theme: {
        color: "#8FBC8F",
      },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  React.useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Oops!",
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
    if (state.success) {
      formRef.current?.reset();
      setDate(new Date());
      // Re-fetch booked dates to include the new one
      const newBookedDate = new Date(date!);
      setBookedDates(prev => [...prev, newBookedDate]);
    }
  }, [state, toast, date]);
  
  const disabledDates = [{ before: new Date() }, ...bookedDates];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <Carousel className="mb-8 w-full overflow-hidden rounded-lg shadow-lg">
            <CarouselContent>
              {venue.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={image.src}
                    alt={`${venue.name} image ${index + 1}`}
                    width={1200}
                    height={700}
                    className="h-[70vh] max-h-[700px] w-full object-cover"
                    data-ai-hint={image.hint}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <Badge variant="secondary" className="mb-2">
                {venue.type}
              </Badge>
              <h1 className="font-headline text-4xl font-bold md:text-5xl">
                {venue.name}
              </h1>
              <div className="mt-2 flex items-center text-md text-muted-foreground">
                <MapPin className="mr-2 h-5 w-5" />
                {venue.location}
              </div>
              <p className="mt-6 text-lg">{venue.description}</p>
              
              <Separator className="my-8" />

              <h2 className="mb-4 font-headline text-2xl font-bold">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {venue.amenities.map((amenity) => (
                  <div key={amenity.name} className="flex items-center">
                    <amenity.icon className="mr-3 h-5 w-5 text-primary" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-8" />

              <h2 className="mb-4 font-headline text-2xl font-bold">
                Contact Owner
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="font-semibold">{venue.owner.name}</p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      <a
                        href={`mailto:${venue.owner.email}`}
                        className="hover:text-primary"
                      >
                        {venue.owner.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>{venue.owner.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    Booking
                  </CardTitle>
                  <CardDescription>
                    {user ? "Check availability and send a request" : "Please log in to make a booking"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">${venue.price}</span>
                    <span className="text-muted-foreground">/day</span>
                  </div>

                  {!user ? (
                     <Button asChild size="lg" className="w-full">
                        <a href="/login">Login to Book</a>
                      </Button>
                  ) : !state.success ? (
                    <form ref={formRef} action={dispatch} className="space-y-4">
                      <input type="hidden" name="venueId" value={venue.id} />
                      <input type="hidden" name="userId" value={user.uid} />
                      <input type="hidden" name="price" value={venue.price} />
                      <div>
                        <Label className="mb-2 block">Select a Date</Label>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border p-0"
                          disabled={disabledDates}
                        />
                         <input type="hidden" name="date" value={date?.toISOString()} />
                           {state.errors?.date && (
                          <p className="text-sm font-medium text-destructive pt-2">
                           {state.errors.date[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Input
                          id="guests"
                          name="guests"
                          type="number"
                          placeholder="e.g., 150"
                          min="1"
                          defaultValue={venue.capacity}
                          
                        />
                         {state.errors?.guests && (
                          <p className="text-sm font-medium text-destructive pt-2">
                            {state.errors.guests[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="message">Message (optional)</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Any special requests?"
                        />
                          {state.errors?.message && (
                          <p className="text-sm font-medium text-destructive pt-2">
                             {state.errors.message[0]}
                          </p>
                        )}
                      </div>
                      <SubmitButton />
                    </form>
                  ) : (
                    <div className="text-center space-y-4 p-4 border-dashed border-2 border-primary/50 rounded-lg">
                       <CheckCircle className="mx-auto h-12 w-12 text-primary" />
                       <h3 className="text-xl font-semibold">Request Sent!</h3>
                       <p className="text-muted-foreground">Your booking request has been successfully sent to the venue owner. You will be notified once it's confirmed.</p>
                       <Button onClick={handlePayment} size="lg" className="w-full">
                         <CreditCard className="mr-2 h-4 w-4" />
                         Proceed to Payment
                       </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
