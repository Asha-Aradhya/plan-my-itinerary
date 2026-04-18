import { z } from 'zod';

export const travelPreferencesSchema = z.object({
  destination: z.string().min(2, 'Please enter a destination'),
  startDate: z.string().min(1, 'Please select a start date'),
  endDate: z.string().min(1, 'Please select an end date'),
  travelers: z.number().min(1).max(20),
  tripType: z.enum(['adventure', 'relaxation', 'cultural', 'family', 'romantic']),
  budget: z.enum(['budget', 'mid-range', 'luxury']),
  pace: z.enum(['slow', 'moderate', 'packed']),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  notes: z.string().optional(),
});

export type TravelPreferences = z.infer<typeof travelPreferencesSchema>;
