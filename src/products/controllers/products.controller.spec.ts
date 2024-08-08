import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsController } from './products.controller';
import { AbstractProductsService } from '../services/abstract-products.service';

class MockProductsService extends AbstractProductsService {
    async getAllProducts(): Promise<any[]> {
        return [
            { id: '1', name: 'Product 1', provider: 'brazilian' },
            { id: '2', name: 'Product 2', provider: 'european' },
        ];
    }

    async getProductById(id: string, provider: string): Promise<any> {
        if (id === '1' && provider === 'brazilian') {
            return { id: '1', name: 'Product 1', provider: 'brazilian' };
        } else if (id === '2' && provider === 'european') {
            return { id: '2', name: 'Product 2', provider: 'european' };
        }
        throw new NotFoundException('Product not found'); // Lança uma exceção NotFoundException
    }
}

describe('ProductsController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                {
                    provide: AbstractProductsService,
                    useClass: MockProductsService,
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/products (GET) - success', () => {
        return request(app.getHttpServer())
            .get('/products')
            .expect(200)
            .expect([
                { id: '1', name: 'Product 1', provider: 'brazilian' },
                { id: '2', name: 'Product 2', provider: 'european' },
            ]);
    });

    it('/products/:provider/:id (GET) - success', () => {
        return request(app.getHttpServer())
            .get('/products/brazilian/1')
            .expect(200)
            .expect({ id: '1', name: 'Product 1', provider: 'brazilian' });
    });

    it('/products/:provider/:id (GET) - not found', () => {
        return request(app.getHttpServer())
            .get('/products/brazilian/999')
            .expect(404);
    });

    afterAll(async () => {
        await app.close();
    });
});
