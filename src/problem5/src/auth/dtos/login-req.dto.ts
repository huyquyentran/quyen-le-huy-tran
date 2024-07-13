import { z } from 'zod';

export const LoginReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginReqDTO = z.infer<typeof LoginReqSchema>;
