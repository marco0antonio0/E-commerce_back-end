import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token não encontrado');
        }

        try {
            const payload = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
            request.token = payload;
        } catch (err) {
            throw new UnauthorizedException('Token inválido');
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | null {
        const [type, token] = (request.headers.authorization || '').split(' ');
        return type === 'Bearer' ? token : null;
    }
}
