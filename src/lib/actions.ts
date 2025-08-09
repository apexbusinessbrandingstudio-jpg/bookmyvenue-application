'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

// Mock database check
const existingBookings = [
  { venueId: 1, date: new Date('2024-08-15') },
];

export type State = {
  errors?: {
    venueId?: string[];
    date?: string[];
    guests?: string[];
    message?: string[];
  };
  message?: string | null;
};

const BookingSchema = z.object({
  venueId: z.coerce.number(),
  date: z.coerce.date(),
  guests: z.coerce.number().gt(0, { message: 'Number of guests must be positive.' }),
  message: z.string().optional(),
});

export async function createBooking(prevState: State, formData: FormData) {
  const validatedFields = BookingSchema.safeParse({
    venueId: formData.get('venueId'),
    date: formData.get('date'),
    guests: formData.get('guests'),
    message: formData.get('message'),
  });
  
  if (validatedFields.success) {
    const { venueId, date } = validatedFields.data;

    // Check for booking conflicts
    const isBooked = existingBookings.some(
      (booking) =>
        booking.venueId === venueId &&
        booking.date.toDateString() === date.toDateString()
    );

    if (isBooked) {
      return {
        errors: {},
        message: 'This date is already booked for the selected venue. Please choose another date.',
      };
    }
    
    // In a real app, you would save the booking to a database here.
    console.log('Booking created:', validatedFields.data);

  } else {
     return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data provided. Please check the form.',
    };
  }

  redirect(`/`);
}
