import { z } from 'zod';

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenReqDTO = z.infer<typeof refreshTokenSchema>;
