import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { user_loginDTO } from '../models/user-models.dto';
import { userDTO } from '../models/user.dto';
import { TokenDTO } from 'src/auth/models/token.dto';

export abstract class AbstractUserService {
    abstract login(user: user_loginDTO): Promise<string>;

    abstract register(user: userDTO): Promise<string>;
    abstract checkJWT(token: TokenDTO): Promise<string>
}
