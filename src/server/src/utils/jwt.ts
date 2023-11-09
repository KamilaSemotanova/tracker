import { readFileSync } from 'fs';
import jwt, { SignOptions } from 'jsonwebtoken';

export const signJwt = (payload: object, options: SignOptions = {}) => {
  const privateKey = readFileSync('private.key');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};
