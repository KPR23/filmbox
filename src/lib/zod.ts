import { object, string } from 'zod';

const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
  string({ required_error: `${type} jest wymagane` })
    .min(8, 'Hasło musi zawierać minumum 8 znaków.')
    .max(32, 'Hasło moze zawierać maksymalnie 32 znaki');

const getEmailSchema = () =>
  string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email');

const getNameSchema = () =>
  string({ required_error: 'Jak się nazywasz?' })
    .min(1, 'Jak się nazywasz?')
    .max(50, 'Nazwa musi zawierać maksymalnie 50 znaków.');

export const signUpSchema = object({
  name: getNameSchema(),
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
  confirmPassword: getPasswordSchema('confirmPassword'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
});

export const forgotPasswordSchema = object({
  email: getEmailSchema(),
});

export const resetPasswordSchema = object({
  password: getPasswordSchema('password'),
  confirmPassword: getPasswordSchema('confirmPassword'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
