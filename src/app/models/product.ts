export interface Product {
    id?: number;
    productName: string;
    description: string;
    price: string;
    stock: string;
    images: string;
    createdAt: Date;
    isActive: boolean;
}

export interface CreateProductRequest {
    products: Product[];
}