import z from "zod"

export const AddReferalSchema = z.object({
    name: z.string().min(2,"name is required"),
    email: z.string().email("email is required"),
    tandc: z.boolean(),
}).refine((data) => data.tandc === true, {
  message: "You must accept the terms and conditions",
  path: ["tandc"],
});

