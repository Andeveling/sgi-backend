import { SetMetadata } from '@nestjs/common';

export type PublicKey = 'isPublic';
export const IS_PUBLIC_KEY: PublicKey = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
