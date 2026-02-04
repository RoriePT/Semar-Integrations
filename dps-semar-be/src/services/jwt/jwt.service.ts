import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  saltRounds: number;
  jwtSecret: string;
  encryptionKey: Buffer;

  constructor() {
    this.saltRounds = 10;
    this.jwtSecret = process.env.JWT_SECRET;

    this.encryptionKey = crypto.scryptSync(
      process.env.ENCRYPTION_SECRET,
      'salt',
      32,
    );
  }

  getHashPassword = (plainPassword: string) => {
    try {
      const salt = bcrypt.genSaltSync(this.saltRounds);
      const hash = bcrypt.hashSync(plainPassword, salt);
      return hash;
    } catch (error) {
      console.log({ error });
    }
  };

  isHashedPasswordVerified = (plainPassword: string, passwordInDB: string) => {
    try {
      return !!bcrypt.compareSync(plainPassword, passwordInDB);
    } catch (error) {
      console.log({ error });
    }
  };

  createToken = (userInDB: any, expiresIn = null) => {
    try {
      let token;
      if (expiresIn)
        token = jwt.sign(userInDB, this.jwtSecret, {
          expiresIn,
        });

      token = jwt.sign(userInDB, this.jwtSecret);

      return token;
    } catch (error) {
      console.log({ error });
    }
  };

  createTokenForWebhookVerification = (payload, merchant_api_key: string) => {
    try {
      const token = jwt.sign(payload, merchant_api_key, {
        expiresIn: '1d',
      });
      return token;
    } catch (error) {
      console.log({ error });
    }
  };

  decodeToken = (token: any) => {
    try {
      return jwt.decode(token);
    } catch (error) {
      console.log({ error });
    }
  };

  verifyToken = (token: any) => {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      console.log({ error });
    }
  };

  // Encrypt a value using AES encryption
  encryptValue = (value: string) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey as any, iv as any);

    try {
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.log({ error });
    }
  };

  // Decrypt a value using AES decryption
  decryptValue = (encryptedValue: string) => {
    const [ivHex, encryptedData] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        this.encryptionKey as any,
        iv as any,
      );

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.log({ error });
    }
  };
}
