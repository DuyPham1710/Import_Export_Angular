export interface Product {
    id?: number;
    productName: string;
    description: string;
    price: string;
    stock: string;
    images: string;
}

export interface CreateProductRequest {
    products: Product[];
}