import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';
import { UserShortType } from '../users/usersType';
import { ProjectShortType } from '../projects/projectType';

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().pipe(nonempty),
  description: z.string().optional(),
  assigned_to: z.string().optional().nullable(),
  project: z.string().optional().nullable(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type TaskSchemaType = z.infer<typeof taskSchema>;

export type TaskResponse = {
  id: string;
  title: string;
  assigned_to: UserShortType;
  description?: string;
  start_date: Date;
  end_date: Date;
  project: ProjectShortType;
};