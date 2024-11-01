export interface TokenAccessWithUser {
  name: string;
  email: string;
  cellphone: string;
  roles: string[];
  accessToken: BearerToken;
}

export type BearerToken = `Bearer ${string}`;
