import { z } from "zod";

export const AddReferalSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    tandc: z.literal(true, {
        errorMap: () => ({
            message: "You must accept the terms and conditions"
        })
    })
});

export type AddReferalRequest = z.infer<typeof AddReferalSchema>;