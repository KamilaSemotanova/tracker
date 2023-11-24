import jwt, { SignOptions } from 'jsonwebtoken';

type Payload = {
  sub: number;
};

export const signJwt = (payload: Payload, options: SignOptions = {}) => {
  if (!process.env.TOKEN_PRIVATE_KEY) {
    throw new Error('TOKEN_PRIVATE_KEY is not defined');
  }

  const privateKey = Buffer.from(process.env.TOKEN_PRIVATE_KEY, 'base64')
    .toString()
    .replace(/\\n/g, '\n');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = (token: string) => {
  if (!process.env.TOKEN_PUBLIC_KEY) {
    throw new Error('TOKEN_PUBLIC_KEY is not defined');
  }

  try {
    const publicKey = Buffer.from(process.env.TOKEN_PUBLIC_KEY, 'base64')
      .toString()
      .replace(/\\n/g, '\n');

    return jwt.verify(token, publicKey) as unknown as Payload;
  } catch (error) {
    return null;
  }
};
