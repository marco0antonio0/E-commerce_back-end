import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AbstractAuthService } from './services/abstract-auth.service';
require('dotenv').config();

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [],
    providers: [
        {
            provide: AbstractAuthService,
            useClass: AuthService,
        },
    ],
    exports: [AbstractAuthService, JwtModule],
})
export class AuthModule { }
