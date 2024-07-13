import { z } from 'zod';

export const UpdateNoteReqSchema = z.object({
  title: z.string().max(100).optional(),
  content: z.string().optional(),
});

export type UpdateNoteReqDTO = z.infer<typeof UpdateNoteReqSchema>;
