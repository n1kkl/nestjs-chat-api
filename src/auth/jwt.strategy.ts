import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authConfig } from './auth.config';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.secret
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUser(payload.sub, 'authId');

    if (!user || !payload.sub) {
      throw new UnauthorizedException('You need to be authorized in order to access this resource.');
    }
    return user;
  }
}