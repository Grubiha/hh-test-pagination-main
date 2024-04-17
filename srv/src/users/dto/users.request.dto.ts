import { z } from 'zod';

export const UsersRequestParamsDto = z
  .object({
    limit: z.coerce.number().int().positive(),
    page: z.coerce.number().int().positive(),
    sort_by: z.union([z.literal('id'), z.literal('createdAt'), z.literal('updatedAt')]),
    sort_order: z.union([z.literal('desc'), z.literal('asc')]),
  })
  .partial();

export type UsersRequestParamsDto = z.infer<typeof UsersRequestParamsDto>;
