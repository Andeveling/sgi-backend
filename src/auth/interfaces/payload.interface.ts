import { $Enums, User } from '@prisma/client';

export interface PayloadToken {
  sub: User['id'];
  roles: $Enums.Role[];
  email: User['email'];
  cellphone: User['cellphone'];
}
