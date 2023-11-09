import { readFileSync } from 'fs';
import jwt, { SignOptions } from 'jsonwebtoken';

type Payload = {
  sub: number;
};

export const signJwt = (payload: Payload, options: SignOptions = {}) => {
  const privateKey = readFileSync('private.key');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = (token: string) => {
  try {
    const publicKey = readFileSync('public.key');

    return jwt.verify(token, publicKey) as unknown as Payload;
  } catch (error) {
    return null;
  }
};
