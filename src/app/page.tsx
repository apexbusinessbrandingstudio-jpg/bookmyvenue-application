import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, DollarSign, Search } from "lucide-react";

// Mock data for venues
const venues = [
  {
    id: 1,
    name: "The Grand Meadow",
    type: "Farmhouse",
    location: "Sunnyvale, CA",
    capacity: 200,
    price: 1500,
    image: "https://placehold.co/600x400.png",
    hint: "farmhouse field",
  },
  {
    id: 2,
    name: "Crystal Ballroom",
    type: "Function Hall",
    location: "Metropolis, NY",
    capacity: 300,
    price: 2500,
    image: "https://placehold.co/600x400.png",
    hint: "ballroom wedding",
  },
  {
    id: 3,
    name: "Oakwood Manor",
    type: "Farmhouse",
    location: "Greenwich, CT",
    capacity: 150,
    price: 3000,
    image: "https://placehold.co/600x400.png",
    hint: "manor exterior",
  },
  {
    id: 4,
    name: "The City Loft",
    type: "Function Hall",
    location: "Downtown, LA",
    capacity: 100,
    price: 1800,
    image: "https://placehold.co/600x400.png",
    hint: "loft interior",
  },
  {
    id: 5,
    name: "Lakeside Retreat",
    type: "Farmhouse",
    location: "Lake Tahoe, NV",
    capacity: 80,
    price: 2200,
    image: "https://placehold.co/600x400.png",
    hint: "lake house",
  },
  {
    id: 6,
    name: "Starlight Pavilion",
    type: "Function Hall",
    location: "Star City, TX",
    capacity: 500,
    price: 4000,
    image: "https://placehold.co/600x400.png",
    hint: "pavilion night",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section
          className="relative flex h-[50vh] max-h-[560px] items-center justify-center bg-cover bg-center text-center"
          style={{ backgroundImage: "url('https://placehold.co/1600x600.png')" }}
          data-ai-hint="venue exterior"
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative
           text-white px-4">
            <h1 className="text-5xl font-bold font-headline md:text-7xl">
              Find Your Perfect Venue
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-body md:text-xl">
              Discover and book unique function halls and farmhouses for your
              special events.
            </p>
          </div>
        </section>

        <section id="venues" className="py-12 md:py-20">
          <div className="container">
            <div className="mb-12 rounded-lg border bg-card p-6 shadow-sm">
              <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="search"
                    className="mb-1 block text-sm font-medium"
                  >
                    Search by name or location
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="e.g., 'Grand Meadow' or 'Sunnyvale'"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="mb-1 block text-sm font-medium"
                  >
                    Venue Type
                  </label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="farmhouse">Farmhouse</SelectItem>
                      <SelectItem value="function-hall">
                        Function Hall
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="lg" className="w-full">
                  Search Venues
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <Card
                  key={venue.id}
                  className="overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1"
                >
                  <Link href={`/venues/${venue.id}`} className="block">
                    <CardHeader className="p-0">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        width={600}
                        height={400}
                        className="h-60 w-full object-cover"
                        data-ai-hint={venue.hint}
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {venue.type}
                      </Badge>
                      <CardTitle className="font-headline text-2xl">
                        {venue.name}
                      </CardTitle>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {venue.location}
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between bg-secondary/30 p-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-primary" />
                          <span>{venue.capacity} Guests</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4 text-primary" />
                          <span>From ${venue.price}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
