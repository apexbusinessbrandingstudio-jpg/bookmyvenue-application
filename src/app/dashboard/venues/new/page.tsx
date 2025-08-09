
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { uploadFile } from "@/lib/storage";

const formSchema = z.object({
  name: z.string().min(1, "Venue name is required."),
  type: z.string().min(1, "Venue type is required."),
  location: z.string().min(1, "Location is required."),
  description: z.string().min(1, "Description is required."),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
  priceDay: z.coerce.number().optional(),
  priceNight: z.coerce.number().optional(),
  price12hr: z.coerce.number().optional(),
  price24hr: z.coerce.number().optional(),
  rules: z.string().optional(),
  images: z.any().refine((files) => files?.length > 0, "At least one image is required."),
  video: z.any().optional(),
}).refine(data => {
    if (data.type === 'Farmhouse') {
        return !!data.price12hr && !!data.price24hr;
    }
    if (data.type === 'Function Hall' || data.type === 'Banquet Hall') {
        return !!data.priceDay && !!data.priceNight;
    }
    return true;
}, {
    message: "Please fill in the prices for the selected venue type.",
    path: ["priceDay"], // can be any of the price fields
});


type VenueFormValues = z.infer<typeof formSchema>;

export default function NewVenuePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      location: "",
      description: "",
      capacity: 0,
      rules: "",
      images: undefined,
      video: undefined,
    },
  });

  const venueType = form.watch("type");

  const onSubmit = async (values: VenueFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a venue.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
        let bookingOptions = "";
        if (values.type === 'Farmhouse') {
            bookingOptions = '12/24 Hour Slots';
        } else if (values.type === 'Function Hall' || values.type === 'Banquet Hall') {
            bookingOptions = 'Day/Night Events';
        }

      const venuePayload: any = {
        ownerId: user.uid,
        status: 'Pending', 
        createdAt: serverTimestamp(),
        name: values.name,
        type: values.type,
        location: values.location,
        description: values.description,
        capacity: values.capacity,
        priceDay: values.priceDay || null,
        priceNight: values.priceNight || null,
        price12hr: values.price12hr || null,
        price24hr: values.price24hr || null,
        rules: values.rules || "",
        bookingOptions: bookingOptions,
        images: [],
        amenities: [],
        videoUrl: "",
      };

      // 1. Create a new venue document to get an ID
      const newVenueRef = await addDoc(collection(db, "venues"), venuePayload);
      
      const venueId = newVenueRef.id;

      // 2. Upload images to Firebase Storage
      const imageUrls = [];
      for (const file of Array.from(values.images as FileList)) {
        const url = await uploadFile(file, `venues/${venueId}/images`);
        imageUrls.push({ src: url, hint: "new venue image" });
      }

      // 3. Upload video if it exists
      let videoUrl = "";
      if (values.video && values.video.length > 0) {
        const videoFile = values.video[0];
        videoUrl = await uploadFile(videoFile, `venues/${venueId}/video`);
      }

      // 4. Update the venue document with the media URLs
       await updateDoc(doc(db, "venues", venueId), { images: imageUrls, videoUrl: videoUrl });
      

      toast({
        title: "Success!",
        description: "Your venue has been submitted for review.",
      });
      router.push("/dashboard/venues");
    } catch (error: any) {
      toast({
        title: "Error creating venue",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Basic Information</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Grand Meadow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                          <SelectItem value="Function Hall">Function Hall</SelectItem>
                          <SelectItem value="Banquet Hall">Banquet Hall</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunnyvale, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Details & Pricing</h3>
              <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Describe what makes your venue special..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Maximum number of guests"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div />
                 {venueType === 'Function Hall' || venueType === 'Banquet Hall' ? (
                    <>
                        <FormField
                            control={form.control}
                            name="priceDay"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Day Event Price</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="$" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="priceNight"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Night Event Price</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="$" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </>
                 ) : venueType === 'Farmhouse' ? (
                     <>
                        <FormField
                            control={form.control}
                            name="price12hr"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>12-Hour Slot Price</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="$" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="price24hr"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>24-Hour Slot Price</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="$" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </>
                 ): null}
              </div>
              
              <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue Rules</FormLabel>
                       <FormControl>
                        <Textarea
                          id="rules"
                          placeholder="e.g., No smoking, no pets, etc."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Media</h3>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Images</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Select one or more images of your venue.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Venue Video</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                     <p className="text-sm text-muted-foreground">
                      Upload a short video of your venue (optional).
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Review
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
