
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';


export type State = {
  errors?: {
    venueId?: string[];
    date?: string[];
    guests?: string[];
    message?: string[];
    userId?: string[];
    price?: string[];
    bookingSession?: string[];
    menuPreference?: string[];
  };
  message?: string | null;
  success?: boolean;
};

const BookingSchema = z.object({
  venueId: z.coerce.number(),
  date: z.coerce.date({
    required_error: "Please select a date.",
    invalid_type_error: "That's not a valid date!",
  }),
  guests: z.coerce.number().gt(0, { message: 'Number of guests must be positive.' }),
  message: z.string().optional(),
  userId: z.string(), // Assuming the user is logged in
  price: z.coerce.number().gt(0, { message: 'Please select a session to see the price.' }),
  bookingSession: z.string({ required_error: 'Please select a booking session.' }).min(1, 'Please select a booking session.'),
  menuPreference: z.string().optional(),
});

export async function createBooking(prevState: State, formData: FormData) {
  const validatedFields = BookingSchema.safeParse({
    venueId: formData.get('venueId'),
    date: formData.get('date'),
    guests: formData.get('guests'),
    message: formData.get('message'),
    userId: formData.get('userId'),
    price: formData.get('price'),
    bookingSession: formData.get('bookingSession'),
    menuPreference: formData.get('menuPreference'),
  });
  
  if (!validatedFields.success) {
     return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data provided. Please check the form.',
      success: false,
    };
  }

  const { venueId, date, guests, message, userId, price, bookingSession, menuPreference } = validatedFields.data;
  
  // Normalize date to remove time part for querying
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  try {
     // Check for booking conflicts (simplified check, doesn't account for session yet)
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, 
      where("venueId", "==", venueId),
      where("date", ">=", Timestamp.fromDate(startOfDay)),
      where("date", "<", Timestamp.fromDate(endOfDay)),
      where("bookingSession", "==", bookingSession)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        // A more complex check would be needed here to see if the *specific session* is booked
      return {
        errors: {
          date: ['This session is already booked for this date. Please choose another.'],
        },
        message: 'Booking failed. The selected session is unavailable.',
        success: false,
      };
    }

    // Add new booking to Firestore
    await addDoc(collection(db, "bookings"), {
      venueId,
      date: Timestamp.fromDate(date),
      guests,
      message,
      userId,
      status: 'Pending',
      bookingSession,
      menuPreference,
      totalAmount: price, 
      createdAt: Timestamp.now(),
      // Mock data that would exist in a real venue collection
      venueName: "The Grand Meadow",
      customerName: "New Customer", // You'd fetch customer name from user profile
    });

    return {
      errors: {},
      message: `Booking request for ${date.toLocaleDateString()} has been sent!`,
      success: true,
    }
  } catch (error) {
    console.error("Firestore error:", error);
    return {
      message: 'Database error. Failed to create booking.',
      success: false,
    }
  }
}
