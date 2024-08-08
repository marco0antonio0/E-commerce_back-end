import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { user_emailDTO, user_idDTO } from '../models/user-models.dto';
import { userDTO } from '../models/user.dto';

@Injectable()
export abstract class AbstractRepositoryUserService {
    abstract findUserById(userIdDTO: user_idDTO): Promise<UserEntity>;

    abstract findUserByEmail(userEmailDTO: user_emailDTO): Promise<UserEntity>;

    abstract createUser(user: userDTO): Promise<UserEntity>;
}
