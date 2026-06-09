// lib/validation/authSchemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contact: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => {
        // Check if the value includes a country code (starts with + and has more than 10 digits)
        const phoneNumber = value.replace(/\D/g, ''); // Remove all non-digit characters
        return phoneNumber.length >= 10 && phoneNumber.length <= 15; // Allow for country code + 10 digits
      },
      {
        message: "Please enter a valid phone number with country code",
      }
    )
    .refine(
      (value) => {
        // Check if the number part (after country code) is exactly 10 digits
        const phoneNumber = value.replace(/\D/g, '');
        const numberPart = phoneNumber.slice(-10); // Get last 10 digits
        return numberPart.length === 10 && /^\d{10}$/.test(numberPart);
      },
      {
        message: "Phone number must be 10 digits (excluding country code)",
      }
    ),
});
