declare module 'passport-jwt' {
  import { Strategy as PassportStrategy } from 'passport';
  import { Request } from 'express';

  export interface StrategyOptions {
    jwtFromRequest: (req: Request) => string | null;
    secretOrKey: string | Buffer;
    ignoreExpiration?: boolean;
    passReqToCallback?: boolean;
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: (payload: any, done: (error: any, user?: any) => void) => void,
    );
  }

  export class ExtractJwt {
    static fromAuthHeaderAsBearerToken(): (req: Request) => string | null;
  }
}
