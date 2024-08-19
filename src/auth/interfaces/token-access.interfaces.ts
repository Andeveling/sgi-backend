export interface TokenAccess {
  accessToken: BearerToken;
}

export type BearerToken = `Bearer ${string}`;
