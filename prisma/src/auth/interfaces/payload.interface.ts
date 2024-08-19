import { User } from '@prisma/client';

export interface PayloadToken {
  sub: User['id'];
  roles: User['roles'];
}
