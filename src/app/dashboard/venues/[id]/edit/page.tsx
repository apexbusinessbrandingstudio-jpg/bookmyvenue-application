
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Trash2, Video } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadFile } from "@/lib/storage";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Venue name is required."),
  type: z.string().min(1, "Venue type is required."),
  location: z.string().min(1, "Location is required."),
  description: z.string().min(1, "Description is required."),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
  price: z.coerce.number().min(1, "Price is required."),
  offerPrice: z.coerce.number().optional(),
  rules: z.string().optional(),
  bookingOptions: z.string().min(1, "Booking options are required."),
  images: z
    .array(
      z.object({
        src: z.string(),
        hint: z.string().optional(),
      })
    )
    .min(1, "At least one image is required."),
  newImages: z.any().optional(),
  videoUrl: z.string().optional(),
  newVideo: z.any().optional(),
});

type VenueFormValues = z.infer<typeof formSchema>;

export default function EditVenuePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const venueId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      location: "",
      description: "",
      capacity: 0,
      price: 0,
      offerPrice: undefined,
      rules: "",
      bookingOptions: "",
      images: [],
      videoUrl: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  useEffect(() => {
    if (!venueId) return;

    const fetchVenue = async () => {
      setFetching(true);
      try {
        const docRef = doc(db, "venues", venueId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const venueData = docSnap.data() as VenueFormValues;
          form.reset({
            ...venueData,
            offerPrice: venueData.offerPrice || undefined,
          });
        } else {
          toast({
            title: "Error",
            description: "Venue not found.",
            variant: "destructive",
          });
          router.push("/dashboard/venues");
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        toast({
          title: "Error",
          description: "Failed to fetch venue data.",
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchVenue();
  }, [venueId, form, toast, router]);

  const onSubmit = async (values: VenueFormValues) => {
    setLoading(true);
    try {
      const { newImages, newVideo, ...venueData } = values;
      const imageUrls = [...venueData.images];
      let videoUrl = venueData.videoUrl || "";

      if (newImages && newImages.length > 0) {
        for (const file of Array.from(newImages as FileList)) {
          const url = await uploadFile(file as File, `venues/${venueId}/images`);
          imageUrls.push({ src: url, hint: "new venue image" });
        }
      }

      if (newVideo && newVideo.length > 0) {
        const videoFile = newVideo[0];
        videoUrl = await uploadFile(videoFile, `venues/${venueId}/video`);
      }
      
      const venueRef = doc(db, "venues", venueId);
      await updateDoc(venueRef, {
        ...venueData,
        offerPrice: venueData.offerPrice || null,
        images: imageUrls,
        videoUrl: videoUrl,
      });

      toast({
        title: "Success!",
        description: "Venue has been updated successfully.",
      });
      router.push("/dashboard/venues");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update venue. " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Edit Venue</CardTitle>
        <CardDescription>
          Update your venue details below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">
                Basic Information
              </h3>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                          <SelectItem value="Function Hall">
                            Function Hall
                          </SelectItem>
                          <SelectItem value="Banquet Hall">
                            Banquet Hall
                          </SelectItem>
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
              <h3 className="text-lg font-medium font-headline">
                Details & Pricing
              </h3>
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
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price (per day/session)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="$" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="offerPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Price (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="$" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="bookingOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Options</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select booking options" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Day/Night Events">Day/Night Events (Halls)</SelectItem>
                          <SelectItem value="12/24 Hour Slots">12/24 Hour Slots (Farmhouses)</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Rules</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="e.g., No smoking, no pets, etc."
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
              <div>
                <Label>Current Images</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {fields.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <Image
                        src={image.src}
                        alt={`Venue image ${index + 1}`}
                        width={200}
                        height={130}
                        className="rounded-md object-cover w-full h-32"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  ))}
                </div>
                 {form.formState.errors.images && (
                    <p className="text-sm font-medium text-destructive pt-2">
                        {form.formState.errors.images.message}
                    </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="newImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload New Images</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

               <div>
                 <Label>Current Video</Label>
                 {form.watch("videoUrl") ? (
                    <div className="mt-2 relative">
                        <video src={form.getValues("videoUrl")} controls className="w-full max-w-md rounded-md" />
                         <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => form.setValue("videoUrl", "")}
                         >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Video
                        </Button>
                    </div>
                 ) : (
                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2 border rounded-md p-4 max-w-md">
                        <Video className="h-5 w-5"/>
                        No video uploaded yet.
                    </div>
                 )}
              </div>


              <FormField
                control={form.control}
                name="newVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload New Video</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
