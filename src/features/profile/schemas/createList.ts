import * as yup from "yup";

export const createListSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: yup
    .string()
    .max(500, "Description must be at most 500 characters")
    .default(""),
});

export type CreateListFormData = yup.InferType<typeof createListSchema>;
