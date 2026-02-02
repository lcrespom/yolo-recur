import { z } from 'zod'

export const paymentFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  location: z.string().trim().min(1, 'Location is required'),
  company: z.string().trim().min(1, 'Company is required'),
  website: z.string().trim(),
  phone: z.string().trim(),
  periodicity: z.number().min(1, 'Periodicity must be at least 1 month'),
  paymentMonth: z
    .number()
    .min(1, 'Payment month must be between 1 and 12')
    .max(12, 'Payment month must be between 1 and 12'),
  paymentDay: z
    .number()
    .min(1, 'Payment day must be between 1 and 31')
    .max(31, 'Payment day must be between 1 and 31'),
  cost: z.number().positive('Cost must be greater than 0'),
  bank: z.string().trim(),
})

export type PaymentFormData = z.infer<typeof paymentFormSchema>
