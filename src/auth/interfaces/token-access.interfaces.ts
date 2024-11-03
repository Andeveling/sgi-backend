import { User } from "@prisma/client";

export interface TokenAccessWithUser {
  token: BearerToken;
  user: Pick<User, 'id' | 'email' | 'cellphone' | "roles" | "name" | "isNew">;
}

export type BearerToken = `Bearer ${string}`;
