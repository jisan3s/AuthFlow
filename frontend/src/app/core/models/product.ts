export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    category: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type ProductPayload = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
