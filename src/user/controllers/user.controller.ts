import { Body, Controller, HttpCode, InternalServerErrorException, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { user_loginDTO } from '../models/user-models.dto';
import { UserService } from '../services/user.service';
import { userDTO } from '../models/user.dto';
import { json } from 'sequelize';
import { AbstractUserService } from '../services/abstract-user.service';
require('dotenv').config()

@ApiTags('user')
@Controller("user")
export class UserController {
    constructor(private readonly userService: AbstractUserService) { }

    @Post("login")
    @HttpCode(200)
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { token: 'jwt_token' } } })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() { email, password }: user_loginDTO) {
        const data = await this.userService.login({ email: email, password: password })
        return { token: data }
    }

    @Post("register")
    @HttpCode(201)
    @ApiBody({
        schema: {
            properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                password: { type: 'string', example: 'password123' }
            }
        }
    })
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'Registration successful', schema: { example: { token: 'jwt_token' } } })
    async register(@Body() { email, name, password }: userDTO) {
        const data = await this.userService.register({ email: email, name: name, password: password })
        return { token: data }
    }
}
