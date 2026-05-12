import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as any,
      ignoreExpiration: false,
      secretOrKey: secret,
    };

    super(options);
  }

  validate(payload: JwtPayload) {
    console.log(payload);
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
