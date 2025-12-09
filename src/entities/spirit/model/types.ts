import { z } from 'zod';

export const spiritSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  threatLevel: z.enum(['Low', 'Medium', 'High', 'Critical'], {
    message: 'Threat level must be one of: Low, Medium, High, Critical',
  }),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Active', 'Captured'], {
    message: 'Status must be Active or Captured',
  }),
});

export type Spirit = z.infer<typeof spiritSchema>;
