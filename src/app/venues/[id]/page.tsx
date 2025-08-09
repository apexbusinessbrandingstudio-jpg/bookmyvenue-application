

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
  CreditCard,
  Clock,
  Video,
  Sun,
  Moon,
  Hourglass,
  IndianRupee,
  Wind,
  Refrigerator,
  Tv,
  Users2,
  Speaker,
  Flower2,
  PersonStanding,
  Beef,
  Vegan,
  Drumstick
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createBooking, type State } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { venues as staticVenues, availableAmenities, menuOptions } from "@/lib/data";
import { useParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const defaultVenue = {
  id: 0,
  name: "Venue Not Found",
  type: "N/A",
  location: "N/A",
  capacity: 0,
  priceDay: null,
  priceNight: null,
  price12hr: null,
  price24hr: null,
  images: [{ src: "https://placehold.co/1200x800.png", hint: "placeholder" }],
  description: "The venue you are looking for could not be found.",
  amenities: [],
  menuOptions: [],
  owner: { name: "N/A", email: "", phone: "" },
  bookingOptions: "N/A",
  videoUrl: ""
};

const ElevatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="18" x="3" y="3" rx="2"/><path d="m7 15 5-5 5 5"/><path d="M12 4v6"/>
    </svg>
)


function SubmitButton() {
  const { pending } = React.useFormStatus();

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
  const params = useParams();
  const venueId = Number(params.id);
  const venue = staticVenues.find((v) => v.id === venueId) || defaultVenue;

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);
  const { user } = useAuth();
  
  const [selectedSession, setSelectedSession] = React.useState<string | undefined>(undefined);
  
  const initialState: State = { message: null, errors: {}, success: false };
  const [state, dispatch] = React.useActionState(createBooking, initialState);
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
    if (venue.id !== 0) {
      fetchBookedDates();
    }
  }, [venue.id]);


  const handlePayment = (price: number) => {
    const options = {
      key: "rzp_test_your_key_id", // Replace with your Test Key ID
      amount: price * 100, // Amount in paise
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
  
  let bookingPrice = 0;
  if(selectedSession === 'day' && venue.priceDay) bookingPrice = venue.priceDay;
  if(selectedSession === 'night' && venue.priceNight) bookingPrice = venue.priceNight;
  if(selectedSession === '12hr' && venue.price12hr) bookingPrice = venue.price12hr;
  if(selectedSession === '24hr' && venue.price24hr) bookingPrice = venue.price24hr;


  const amenityIcons: { [key: string]: React.ElementType } = {
    'wifi': Wifi,
    'parking': ParkingSquare,
    'catering': UtensilsCrossed,
    'ac': Wind,
    'refrigerator': Refrigerator,
    'tv': Tv,
    'bridal-suite': Users2,
    'sound-system': Speaker,
    'valet-parking': ParkingSquare,
    'in-house-decor': Flower2,
    'lift': ElevatorIcon,
    'dressing-room': PersonStanding,
  };
  
  const menuIcons: { [key: string]: React.ElementType } = {
      'veg': Vegan,
      'non-veg': Drumstick,
      'beef': Beef
  };

  const getAmenityDetails = (amenityId: string) => {
      return availableAmenities.find(a => a.id === amenityId);
  }
  
  const getMenuOptionDetails = (optionId: string) => {
      return menuOptions.find(o => o.id === optionId);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <Carousel className="mb-8 w-full overflow-hidden rounded-lg shadow-lg">
            <CarouselContent>
              {(venue.images || []).map((image, index) => (
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
              <div className="mt-4 flex items-center text-md text-muted-foreground">
                <Clock className="mr-2 h-5 w-5" />
                {venue.bookingOptions}
              </div>
              <p className="mt-6 text-lg">{venue.description}</p>
              
              <Separator className="my-8" />
              
              {venue.videoUrl && (
                  <>
                    <h2 className="mb-4 font-headline text-2xl font-bold flex items-center gap-2">
                      <Video />
                      Venue Video
                    </h2>
                    <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
                       <video src={venue.videoUrl} controls className="w-full" />
                    </div>
                    <Separator className="my-8" />
                  </>
              )}


              <h2 className="mb-4 font-headline text-2xl font-bold">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(venue.amenities || []).map((amenityId) => {
                  const amenity = getAmenityDetails(amenityId);
                  if (!amenity) return null;
                  const Icon = amenityIcons[amenity.id] || CheckCircle;
                  return (
                    <div key={amenity.id} className="flex items-center">
                      <Icon className="mr-3 h-5 w-5 text-primary" />
                      <span>{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
              
              <Separator className="my-8" />
              
              <h2 className="mb-4 font-headline text-2xl font-bold">
                Menu Options
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {(venue.menuOptions || []).map((optionId) => {
                  const option = getMenuOptionDetails(optionId);
                  if (!option) return null;
                  const Icon = menuIcons[option.id] || UtensilsCrossed;
                  return (
                    <div key={option.id} className="flex items-center">
                      <Icon className="mr-3 h-5 w-5 text-primary" />
                      <span>{option.name}</span>
                    </div>
                  );
                })}
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
                   <div className="text-center">
                     {bookingPrice > 0 ? (
                        <p className="text-4xl font-bold text-accent">₹{bookingPrice}<span className="text-lg font-normal text-muted-foreground">/session</span></p>
                     ) : (
                        <p className="text-lg text-muted-foreground">Select a session to see the price</p>
                     )}
                   
                  </div>

                  {!user ? (
                     <Button asChild size="lg" className="w-full">
                        <a href="/login">Login to Book</a>
                      </Button>
                  ) : !state.success ? (
                    <form ref={formRef} action={dispatch} className="space-y-4">
                      <input type="hidden" name="venueId" value={venue.id} />
                      <input type="hidden" name="userId" value={user.uid} />
                      <input type="hidden" name="price" value={bookingPrice} />
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
                        <Label>Select Session</Label>
                        <RadioGroup 
                            name="bookingSession" 
                            className="mt-2 grid grid-cols-2 gap-4"
                            onValueChange={setSelectedSession}
                            value={selectedSession}
                        >
                             {venue.type === 'Function Hall' || venue.type === 'Banquet Hall' ? (
                                <>
                                    <Label className="flex flex-col items-center gap-2 border rounded-md p-3 cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                                        <RadioGroupItem value="day" id="day" className="sr-only"/>
                                        <Sun/>
                                        <span>Day Event</span>
                                        {venue.priceDay && <span className="font-bold">₹{venue.priceDay}</span>}
                                    </Label>
                                    <Label className="flex flex-col items-center gap-2 border rounded-md p-3 cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                                        <RadioGroupItem value="night" id="night" className="sr-only"/>
                                        <Moon/>
                                        <span>Night Event</span>
                                        {venue.priceNight && <span className="font-bold">₹{venue.priceNight}</span>}
                                    </Label>
                                </>
                             ) : venue.type === 'Farmhouse' ? (
                                 <>
                                    <Label className="flex flex-col items-center gap-2 border rounded-md p-3 cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                                        <RadioGroupItem value="12hr" id="12hr" className="sr-only"/>
                                        <Hourglass className="h-5 w-5"/>
                                        <span>12 Hours</span>
                                         {venue.price12hr && <span className="font-bold">₹{venue.price12hr}</span>}
                                    </Label>
                                    <Label className="flex flex-col items-center gap-2 border rounded-md p-3 cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                                        <RadioGroupItem value="24hr" id="24hr" className="sr-only"/>
                                        <Hourglass />
                                        <span>24 Hours</span>
                                        {venue.price24hr && <span className="font-bold">₹{venue.price24hr}</span>}
                                    </Label>
                                </>
                             ) : null }
                        </RadioGroup>
                         {state.errors?.bookingSession && (
                          <p className="text-sm font-medium text-destructive pt-2">
                            {state.errors.bookingSession[0]}
                          </p>
                        )}
                      </div>
                       <div>
                         <Label htmlFor="menuPreference">Menu Preference</Label>
                          <Select name="menuPreference">
                            <SelectTrigger id="menuPreference">
                              <SelectValue placeholder="Select a menu type" />
                            </SelectTrigger>
                            <SelectContent>
                                {(venue.menuOptions || []).map(optionId => {
                                    const option = getMenuOptionDetails(optionId);
                                    if (!option) return null;
                                    return <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                                })}
                            </SelectContent>
                          </Select>
                          {state.errors?.menuPreference && (
                            <p className="text-sm font-medium text-destructive pt-2">
                                {state.errors.menuPreference[0]}
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
                       <Button onClick={() => handlePayment(bookingPrice)} size="lg" className="w-full">
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
