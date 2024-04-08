import { User } from "firebase/auth";
import { CartItem, Order, Product, ShippingInfo } from "./types";

export type MessageResponse = {
  success: boolean;
  message: string;
}

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type UserResponse = {
  success: boolean;
  message: string;
  user: User;
}

export type LatestProductsResponse = {
  success: boolean;
  total: number;
  message: string;
  latestProducts: Product[]
}

export type AllProductsResponse = {
  success: boolean;
  total: number;
  message: string;
  latestProducts: Product[]
}

export type CategoriesResponse = {
  success: boolean;
  message: string;
  categories: string[]
}

export type SearchProductsResponse = {
  success: boolean;
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  messages: string;
  searchedProducts: Product[];
}

export type SearchProductsRequest = {
  search?: string;
  price?: number;
  category?: string;
  sort?: string;
  page?: number;
}

export type NewProductRequest = {
  id: string;
  formData: FormData;
}

export type SingleProductResponse = {
  success: boolean;
  message: string;
  product: Product;
}

export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
}

export type DeleteProductRequest = {
  userId: string;
  productId: string;
}

export type NewOrderRequest = {
  orderItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
  userId: string;
}

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
}

export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
}

export type UpdateOrderRequest = {
  adminId: string;
  orderId: string;
}