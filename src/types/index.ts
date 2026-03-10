export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
  formatPrice: () => string;
}

export interface ProductList {
  total: number;
  items: Product[];
}

export interface UserData {
  email: string;
  phone: string;
  address: string;
}

export type OrderProduct = Pick<Product, 'id' | 'title' | 'price'>;

export type Payment = "card" | "cash";

export interface Order extends UserData {
  payment: Payment;
  total: number;
  items: OrderProduct[]
}

export interface ApiError {
  error: string;
}

export interface ApiOrder {
  id: string;
  total: number;
}

export interface ApiOrderBody extends UserData {
  payment: Payment;
  total: number;
  items: string[];
}
