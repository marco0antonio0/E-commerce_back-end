import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AbstractProductsService } from './abstract-products.service';
import { AxiosResponse } from 'axios';

@Injectable()
export class ProductsService implements AbstractProductsService {
    private readonly brazilianProviderUrl = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider';
    private readonly europeanProviderUrl = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider';

    private cachedProducts = null; // Variável de instância para armazenar os produtos randomizados

    constructor(private readonly httpService: HttpService) { }

    // Função para embaralhar um array usando o algoritmo Fisher-Yates
    private shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Método para obter todos os produtos de ambos os fornecedores
    async getAllProducts() {
        // Se os produtos já foram carregados e embaralhados, retorna o cache
        if (this.cachedProducts) {
            return this.cachedProducts;
        }

        try {
            // Realiza chamadas paralelas para os fornecedores e espera que ambas sejam concluídas
            const [brazilianProductsResponse, europeanProductsResponse]: [AxiosResponse<any>, AxiosResponse<any>] = await Promise.all([
                lastValueFrom(this.httpService.get(this.brazilianProviderUrl)),
                lastValueFrom(this.httpService.get(this.europeanProviderUrl)),
            ]);

            // Adiciona a propriedade "provider" para identificar a origem dos produtos
            const brazilianProducts = brazilianProductsResponse.data.map(product => ({
                ...product,
                provider: 'brazilian'
            }));

            const europeanProducts = europeanProductsResponse.data.map(product => ({
                ...product,
                provider: 'european'
            }));

            // Combina os produtos de ambos os fornecedores e embaralha
            const combinedProducts = [...brazilianProducts, ...europeanProducts];
            const shuffledProducts = this.shuffleArray(combinedProducts);

            // Armazena os produtos embaralhados na memória
            this.cachedProducts = shuffledProducts;

            // Retorna os produtos embaralhados
            return this.cachedProducts;
        } catch (error) {
            // Lança uma exceção se houver um erro ao buscar os produtos
            throw new NotFoundException('Product not found');
        }
    }

    // Método para obter um produto específico por ID e fornecedor
    async getProductById(id: string, provider: string) {
        try {
            const providerUrl = provider === 'brazilian' ? this.brazilianProviderUrl : this.europeanProviderUrl;

            const productResponse: AxiosResponse<any> = await lastValueFrom(
                this.httpService.get(`${providerUrl}/${id}`)
            );

            return {
                ...productResponse.data,
                provider
            };
        } catch (error) {
            throw new NotFoundException('Product not found');
        }
    }
}
