import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  /** @default 1 */
  page: z.coerce.number().int().positive().default(1),
  /** @default 10 */
  limit: z.coerce.number().int().positive().default(10),
  /** @default asc */
  sort: z.enum(['asc', 'desc']).default('asc'),
  /** @default createdAt */
  sortBy: z.enum(['createdAt']).default('createdAt'),
});

export type PaginationQueryDTO = z.infer<typeof PaginationQuerySchema>;
