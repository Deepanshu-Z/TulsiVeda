import * as z from "zod";
const categories = [
  "Uncategorized",
  "Health & Fitness",
  "Suppliments",
  "Skin",
  "Hygiene",
] as const;
const form = ["powder", "capsule", "tablet", "liquid"] as const;

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price is required"),
  discountPrice: z
    .number()
    .min(1, "Discount must be greater than 0")
    .optional(),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  category: z.enum(categories).default("Uncategorized"),
  inStock: z.boolean().default(true),
  images: z.array(z.string()).optional(),
  form: z.enum(form).default("capsule"),
  goal: z.array(z.string()),
  ingredients: z.array(z.string()),
  allergens: z.array(z.string()),
  directions: z.string("directions"),
  certifications: z.array(z.string()),
  expiryDate: z.coerce.date(),
  manufacturedDate: z.coerce.date(),
});
export type ProductInput = z.infer<typeof productSchema>;
