import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartEntity } from './repositories/entities/product.entity';
import { AbstractCartService } from './services/abstract-cart.service';
import { RepositoryCartService } from './repositories/repository-cart.service';
import { CartService } from './services/cart.service';
import { AbstractRepositoryCartService } from './repositories/abstract-repository-cart.service';
import { CartController } from './controllers/cart.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule,
        SequelizeModule.forFeature([CartEntity])],
    providers: [
        {
            provide: AbstractRepositoryCartService,
            useClass: RepositoryCartService,
        },
        {
            provide: AbstractCartService,
            useClass: CartService
        }
    ],
    controllers: [CartController],
})
export class CartModule { }
