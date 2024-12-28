import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().pipe(nonempty),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;

export type ProjectResponse = {
  id: string;
  title: string;
  start_date: Date;
  end_date: Date;
};

export type ProjectShortType = {
  id: string;
  title: string;
};