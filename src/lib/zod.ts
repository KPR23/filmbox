import { object, string } from 'zod';

const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
  string({ required_error: `${type} jest wymagane` })
    .min(8, 'Hasło musi zawierać minumum 8 znaków.')
    .max(32, 'Hasło moze zawierać maksymalnie 32 znaki');

const getEmailSchema = () =>
  string({ required_error: 'E-mail jest wymagany' })
    .min(1, 'E-mail jest wymagany')
    .email('Nieprawidłowy e-mail');

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

const passwordSchema = string({ required_error: `Hasło jest wymagane` }).min(
  1,
  'Hasło jest wymagane'
);

export const signInSchema = object({
  email: getEmailSchema(),
  password: passwordSchema,
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
