import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  username: z.string(),
  is_staff: z.boolean(),
  password: z.string(),
});

export type UserSchemaType = z.infer<typeof userSchema>;

export type UserResponse = {
  id: string;
  email: string;
  username: string;
  is_staff: boolean;
  password: string;
};

export type UserShortType = {
  id: string;
  email: string;
  username: string;
};
