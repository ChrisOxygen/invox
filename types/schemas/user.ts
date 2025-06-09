import { z } from "zod";
import { updateUserSchema, changePasswordSchema } from "@/dataSchemas";

// User management schema-derived types
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Additional user-related types
export type UserProfileUpdate = UpdateUserInput;
export type PasswordChangeRequest = ChangePasswordInput;
