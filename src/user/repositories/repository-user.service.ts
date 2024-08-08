/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';
import { where } from 'sequelize';
import { user_emailDTO, user_idDTO } from '../models/user-models.dto';
import { userDTO } from '../models/user.dto';
import { AbstractRepositoryUserService } from './abstract-repository-user.service';

@Injectable()
export class Repository_userService implements AbstractRepositoryUserService {
    constructor(
        @InjectModel(UserEntity)
        private readonly userModel: typeof UserEntity,
    ) { }

    async findUserById({ id }: user_idDTO): Promise<UserEntity> {
        const user = await this.userModel.findOne({ where: { id } })
        return user
    }

    async findUserByEmail({ email }: user_emailDTO): Promise<UserEntity> {
        const user = await this.userModel.findOne({ where: { email } })
        return user
    }

    async createUser(user: userDTO): Promise<UserEntity> {
        const data = await this.userModel.create(user)
        return data
    }
}
