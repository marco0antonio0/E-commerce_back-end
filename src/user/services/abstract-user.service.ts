import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { user_loginDTO } from '../models/user-models.dto';
import { userDTO } from '../models/user.dto';

export abstract class AbstractUserService {
    abstract login(user: user_loginDTO): Promise<string>;

    abstract register(user: userDTO): Promise<string>;
}
