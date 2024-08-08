import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { sequelizeConfig } from './config/databasse.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    CartModule,
    ProductsModule,
    AuthModule,
    UserModule,],
  controllers: [],
  providers: [
  ],
})
export class AppModule { }
