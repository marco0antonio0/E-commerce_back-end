/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from '../models/token.dto';
import { user_emailDTO } from 'src/user/models/user-models.dto';
import { AbstractAuthService } from './abstract-auth.service';

@Injectable()
export class AuthService implements AbstractAuthService {
    constructor(private readonly JWTService: JwtService) { }

    async createToken({ email }: user_emailDTO) {
        return this.JWTService.sign({
            sub: email, admin: false
        },
            {
                audience: 'login|register',
                expiresIn: '24h',
            })
    }
    async checkToken({ token }: TokenDTO) {
        return this.JWTService.verify(token)
    }
}
