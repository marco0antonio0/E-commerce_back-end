
export abstract class AbstractProductsService {
    abstract getAllProducts(): Promise<any[]>;

    abstract getProductById(id: string, provider: string): Promise<any>;
}
