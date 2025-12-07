import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {createParamDecorator,ExecutionContext} from '@nestjs/common'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // whatever you attach here becomes available as req.user
    return { userId: payload.sub, email: payload.email };
  }
}
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}
export const CurrentUser = createParamDecorator(
  (data:unknown, ctx:ExecutionContext) =>{
    const request  = ctx.switchToHttp().getRequest()
    return request.user
  }
)
