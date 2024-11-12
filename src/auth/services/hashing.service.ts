import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class HashingService {
  private readonly saltOrRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.saltOrRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
