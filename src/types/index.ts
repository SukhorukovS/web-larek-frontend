export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
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

export interface IUserForm {
  email: string;
  phone: string;
}

export type FormErrors = Partial<Record<keyof IUserForm, string>>;

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
