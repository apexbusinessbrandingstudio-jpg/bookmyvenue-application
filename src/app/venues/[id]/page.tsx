"use client";

import * as React from "react";
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
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

export default function VenueDetailPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

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
                    Check availability and send a request
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">${venue.price}</span>
                    <span className="text-muted-foreground">/day</span>
                  </div>

                  <div>
                    <Label className="mb-2 block">Check Availability</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border p-0"
                    />
                  </div>

                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        placeholder="e.g., 150"
                        defaultValue={venue.capacity}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message (optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Any special requests?"
                      />
                    </div>
                    <Button
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Send Booking Request
                    </Button>
                  </form>
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
