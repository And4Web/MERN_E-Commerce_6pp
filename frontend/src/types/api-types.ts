import { User } from "firebase/auth";
import { Product } from "./types";

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