import { z } from 'zod';

export const CreateNoteReqSchema = z.object({
  title: z.string().max(100),
  content: z.string().optional(),
});

export type CreateNoteReqDTO = z.infer<typeof CreateNoteReqSchema>;
