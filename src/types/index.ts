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

export interface Order extends UserData {
  payment: "online" | "offline";
  total: number;
  items: Pick<Product, 'id'>[]
}

export interface ApiError {
  error: string;
}

export interface ApiOrder {
  id: string;
  total: number;
}
