/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from '../models/token.dto';
import { user_emailDTO } from 'src/user/models/user-models.dto';
import { AbstractAuthService } from './abstract-auth.service';

@Injectable()
export class AuthService implements AbstractAuthService {
    constructor(private readonly JWTService: JwtService) { }

    async createToken({ email }: user_emailDTO) {
        try {
            const payload = this.JWTService.sign({
                sub: email, admin: false
            },
                {
                    audience: 'login|register',
                    expiresIn: '24h',
                })
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado.');
        }

    }
    async checkToken({ token }: TokenDTO) {
        return this.JWTService.verify(token)
    }
}
