export type Product = {
    id: number;
    name: string;
    price: number;
    slug: string;
}

export type User = {
    name: string;
    email: string;
    id: number;
    favorites: number[]
}