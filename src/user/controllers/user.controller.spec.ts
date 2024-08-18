import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from './user.controller';
import { AbstractUserService } from '../services/abstract-user.service';
import { user_loginDTO } from '../models/user-models.dto';
import { userDTO } from '../models/user.dto';
import { TokenDTO } from '../../auth/models/token.dto';

class MockUserService extends AbstractUserService {
    async login(userLoginDto: user_loginDTO): Promise<string> {
        if (userLoginDto.email === 'test@example.com' && userLoginDto.password === 'password') {
            return 'mock_jwt_token';
        }
        throw new UnauthorizedException();
    }

    async register(userDto: userDTO): Promise<string> {
        return 'mock_jwt_token';
    }

    async checkJWT(tokenDto: TokenDTO): Promise<string> {
        if (tokenDto.token === 'valid_jwt_token') {
            return 'valid_jwt_token';
        }
        throw new UnauthorizedException();
    }
}

describe('UserController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: AbstractUserService,
                    useClass: MockUserService,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/user/login (POST) - success', () => {
        return request(app.getHttpServer())
            .post('/user/login')
            .send({ email: 'test@example.com', password: 'password' })
            .expect(200)
            .expect({ token: 'mock_jwt_token' });
    });

    it('/user/login (POST) - unauthorized', () => {
        return request(app.getHttpServer())
            .post('/user/login')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' })
            .expect(401);
    });

    it('/user/register (POST) - success', () => {
        return request(app.getHttpServer())
            .post('/user/register')
            .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
            .expect(201)
            .expect({ token: 'mock_jwt_token' });
    });

    it('/user/check-token (POST) - success', () => {
        return request(app.getHttpServer())
            .post('/user/check-token')
            .send({ token: 'valid_jwt_token' })
            .expect(200)
            .expect({ token: 'valid_jwt_token' });
    });

    it('/user/check-token (POST) - unauthorized', () => {
        return request(app.getHttpServer())
            .post('/user/check-token')
            .send({ token: 'invalid_jwt_token' })
            .expect(401);
    });

    afterAll(async () => {
        await app.close();
    });
});
