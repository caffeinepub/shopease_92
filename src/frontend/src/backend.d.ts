import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    title: string;
    description: string;
    stockCount: bigint;
    imageUrl: string;
    category: string;
    brand: string;
    rating: number;
    price: bigint;
}
export type Time = bigint;
export interface ProductUpdate {
    title: string;
    description: string;
    stockCount: bigint;
    imageUrl: string;
    category: string;
    brand: string;
    rating: number;
    price: bigint;
}
export interface Cart {
    createdAt: Time;
    updatedAt: Time;
    items: Array<CartItem>;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    addToCallerCart(productId: bigint, quantity: bigint): Promise<void>;
    addToCart(user: Principal, productId: bigint, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCallerCart(): Promise<void>;
    clearCart(user: Principal): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerCart(): Promise<Cart>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(user: Principal): Promise<Cart>;
    getProduct(productId: bigint): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsFiltered(byCategory: string | null): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCallerCart(productId: bigint): Promise<void>;
    removeFromCart(user: Principal, productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCallerCartItem(productId: bigint, quantity: bigint): Promise<void>;
    updateCartItem(user: Principal, productId: bigint, quantity: bigint): Promise<void>;
    updateProduct(productId: bigint, update: ProductUpdate): Promise<void>;
}
