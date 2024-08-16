import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AbstractProductsService } from './abstract-products.service';
import { AxiosResponse } from 'axios';
const Fuse = require('fuse.js');


@Injectable()
export class ProductsService implements AbstractProductsService {
    private readonly brazilianProviderUrl = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider';
    private readonly europeanProviderUrl = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider';

    private cachedProducts = null; // Variável de instância para armazenar os produtos randomizados

    constructor(private readonly httpService: HttpService) { }

    private shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async getAllProducts() {
        if (this.cachedProducts) {
            return this.cachedProducts;
        }

        try {
            const [brazilianProductsResponse, europeanProductsResponse]: [AxiosResponse<any>, AxiosResponse<any>] = await Promise.all([
                lastValueFrom(this.httpService.get(this.brazilianProviderUrl)),
                lastValueFrom(this.httpService.get(this.europeanProviderUrl)),
            ]);

            const brazilianProducts = brazilianProductsResponse.data.map((product) => {
                if (typeof (product) != typeof ("")) {
                    return ({
                        ...product,
                        provider: 'brazilian',
                    });
                }
            })


            const europeanProducts = europeanProductsResponse.data.map((product) => {
                if (typeof (product) != typeof ("")) {
                    return ({
                        ...product,
                        provider: 'european',
                    })
                }


            });

            const combinedProducts = [...brazilianProducts, ...europeanProducts];
            const shuffledProducts = this.shuffleArray(combinedProducts);

            this.cachedProducts = shuffledProducts;
            return this.cachedProducts;
        } catch (error) {
            throw new NotFoundException('Product not found');
        }
    }

    async getProductById(id: string, provider: string) {
        try {
            const providerUrl = provider === 'brazilian' ? this.brazilianProviderUrl : this.europeanProviderUrl;

            const productResponse: AxiosResponse<any> = await lastValueFrom(
                this.httpService.get(`${providerUrl}/${id}`)
            );

            return {
                ...productResponse.data,
                provider,
            };
        } catch (error) {
            throw new NotFoundException('Product not found');
        }
    }

    async searchProductsByName(name: string) {
        const products = await this.getAllProducts();

        // Normalizar o texto do nome da busca para minúsculas
        const normalizedSearchTerm = name.toLowerCase();

        // Opções do Fuse.js
        const options = {
            keys: ['name', 'nome'],
            threshold: 0.3,
            // Normaliza o texto dos produtos para minúsculas para garantir busca case-insensitive
            getFn: (obj, path) => {
                const value = Fuse.config.getFn(obj, path);
                return typeof value === 'string' ? value.toLowerCase() : '';
            }
        };

        // Cria uma nova instância do Fuse.js com os produtos normalizados
        const fuse = new Fuse(products, options);

        // Realiza a busca usando o termo normalizado
        const result = fuse.search(normalizedSearchTerm);

        if (result.length === 0) {
            throw new NotFoundException(`No products found with name similar to "${name}"`);
        }

        return result.map(res => res.item);
    }
}
