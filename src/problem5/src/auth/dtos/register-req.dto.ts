import { z } from 'zod';

export const RegisterReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export type RegisterReqDTO = z.infer<typeof RegisterReqSchema>;
