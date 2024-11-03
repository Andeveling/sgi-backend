import { $Enums, User } from '@prisma/client';

export interface PayloadToken {
  id: User['id'];
  sub: User['id'];
  name: User['name'];
  isNew: User['isNew'];
  roles: $Enums.Role[];
  email: User['email'];
  cellphone: User['cellphone'];
}
