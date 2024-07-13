import { PaginationQuerySchema } from '../../shared/dtos/pagination-query.dto';
import { z } from 'zod';

export const NoteQuerySchema = PaginationQuerySchema.extend({
  title: z.string().max(100).optional(),
  sortBy: z.enum(['title', 'createdAt']).default('createdAt'),
});

export type NoteQueryDTO = z.infer<typeof NoteQuerySchema>;
