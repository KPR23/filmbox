import { z } from 'zod';

// Define the user schema based on the Prisma User model
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().optional(),
  premium: z.boolean().default(false),
  role: z.string().default('user'),
  banned: z.boolean().default(false),
  banReason: z.string().nullable().optional(),
  banExpires: z.number().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create a type from the schema
export type User = z.infer<typeof userSchema>;

// For user details that might come from an API or database
export const userDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().nullable().optional(),
});

export type UserDetails = z.infer<typeof userDetailsSchema>;

// Simple schema for when we only need basic user info
export const basicUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
});

export type BasicUser = z.infer<typeof basicUserSchema>;
