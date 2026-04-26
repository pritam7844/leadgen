import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const leadSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  city: z.string().optional(),
})

export const emailProviderSchema = z.object({
  label: z.string().min(1, 'Label required'),
  host: z.string().min(1, 'SMTP host required'),
  port: z.coerce.number().min(1).max(65535),
  username: z.string().min(1, 'Username required'),
  encryptedPassword: z.string().min(1, 'Password required'),
  fromName: z.string().min(1, 'From name required'),
  fromEmail: z.string().email('Invalid email'),
  replyToEmail: z.string().email().optional().or(z.literal('')),
})
