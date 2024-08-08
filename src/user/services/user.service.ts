import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { user_loginDTO } from '../models/user-models.dto';
import { userDTO } from '../models/user.dto';
import * as bcrypt from 'bcrypt';
import { AbstractUserService } from './abstract-user.service';
import { AbstractRepositoryUserService } from '../repositories/abstract-repository-user.service';
import { AbstractAuthService } from 'src/auth/services/abstract-auth.service';

@Injectable()
export class UserService extends AbstractUserService {
    constructor(
        private readonly repositoryUser: AbstractRepositoryUserService,
        private readonly auth: AbstractAuthService,
    ) {
        super();
    }

    async login(user: user_loginDTO): Promise<string> {
        const data = await this.repositoryUser.findUserByEmail({ email: user.email });
        if (!data) {
            throw new NotFoundException('Email não registrado');
        }
        const validationPassword = await bcrypt.compare(user.password, data.password);
        if (!validationPassword) {
            throw new UnauthorizedException('Email e/ou senha incorretos');
        }
        const token = await this.auth.createToken(user);
        return token;
    }

    async register(user: userDTO): Promise<string> {
        const isEmailFound = await this.repositoryUser.findUserByEmail({ email: user.email });

        if (isEmailFound) {
            throw new ConflictException('Email já registrado');
        }

        user.password = await bcrypt.hash(user.password, 10);
        await this.repositoryUser.createUser(user);

        const token = await this.auth.createToken(user);
        return token;
    }
}
