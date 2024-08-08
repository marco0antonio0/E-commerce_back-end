import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UserEntity } from './repositories/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { Repository_userService } from './repositories/repository-user.service';
import { AbstractRepositoryUserService } from './repositories/abstract-repository-user.service';
import { AbstractUserService } from './services/abstract-user.service';

@Module({
    imports: [SequelizeModule.forFeature([UserEntity]), AuthModule],
    controllers: [
        UserController,],
    providers: [
        { provide: AbstractUserService, useClass: UserService },
        { provide: AbstractRepositoryUserService, useClass: Repository_userService }],
})
export class UserModule { }
