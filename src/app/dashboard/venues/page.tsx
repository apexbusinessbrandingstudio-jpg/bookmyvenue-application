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
import { Plus, Edit, Bot, View } from "lucide-react";

const myVenues = [
  {
    id: 1,
    name: "The Grand Meadow",
    type: "Farmhouse",
    location: "Sunnyvale, CA",
    status: "Published",
    image: "https://placehold.co/600x400.png",
    hint: "farmhouse field",
  },
  {
    id: 7,
    name: "My New Hall",
    type: "Function Hall",
    location: "City Center",
    status: "Draft",
    image: "https://placehold.co/600x400.png",
    hint: "modern hall",
  },
];

export default function MyVenuesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold font-headline">My Venues</h1>
        <Button asChild>
          <Link href="/dashboard/venues/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Venue
          </Link>
        </Button>
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
                        venue.status === "Published" ? "default" : "secondary"
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
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/venues/${venue.id}`}>
                      <View className="mr-2 h-4 w-4" /> View Listing
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
