import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
  }

  async register(dto: AuthDto) {
    // encrypt password
    const hash = await argon.hash(dto.password);
    try {
      // save the new user to the database
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
          role: 'admin',
        },
      });

      delete user.password;
      // return the new user with success message
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Email is already taken');
        }
      }
      throw err;
    }
  }

  async login(dto: LoginDto) {
    //TODO ADD LOGINDTO
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email: email,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
