import { z } from 'zod';
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './zod';
import { Session } from '@/auth/auth';

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export interface User {
  id: string;
  name: string;
  tag: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  premium: boolean;
  role: string;
  banned: boolean;
  banReason?: string;
  banExpires?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits: {
    crew: { job: string; name: string }[];
    cast: { name: string }[];
  };
  runtime: number;
  original_language: string;
  production_countries: { name: string }[];
  budget: number;
  revenue: number;
}

export interface LoginFormProps extends React.ComponentProps<'div'> {
  className?: string;
}

export interface EmailCheckResponse {
  exists: boolean;
  name?: string;
  emailVerified?: boolean;
  error?: string;
}

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type FormFieldName = 'email' | 'password';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
  session?: Session;
}

export type SocialProvider = 'google';

export interface EmailData {
  to: string;
  subject: string;
  text: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}
