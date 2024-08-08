import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ProductsService } from "./services/products.service";
import { ProductsController } from "./controllers/products.controller";
import { AbstractProductsService } from "./services/abstract-products.service";

@Module({
    imports: [HttpModule],
    providers: [{ provide: AbstractProductsService, useClass: ProductsService }],
    controllers: [ProductsController],
})
export class ProductsModule { }
