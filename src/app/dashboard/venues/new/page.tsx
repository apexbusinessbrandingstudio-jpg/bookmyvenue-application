"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function NewVenuePage() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">
          Register a New Venue
        </CardTitle>
        <CardDescription>
          Fill out the form below to list your property on BOOKMYVENUE.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Basic Information</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Venue Name</Label>
              <Input id="name" placeholder="e.g., The Grand Meadow" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Venue Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmhouse">Farmhouse</SelectItem>
                    <SelectItem value="function-hall">Function Hall</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Sunnyvale, CA" />
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Details & Pricing</h3>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what makes your venue special..."
                rows={5}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Maximum number of guests"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Base Price (per day)</Label>
                <Input id="price" type="number" placeholder="$" />
              </div>
            </div>
          </div>
          
          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium font-headline">Media</h3>
            <Label htmlFor="images">Upload Images</Label>
            <Input id="images" type="file" multiple />
            <p className="text-sm text-muted-foreground">
              Select one or more images of your venue.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Submit for Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
