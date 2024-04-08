export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
}

export type Product = {
  name: string;
  price: number;
  stock: number;
  category: string;
  photo: string;
  _id: string;
} 

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export type CartItem = {
  productId: string;
  photo: string;
  name: string;
  price: string;
  quantity: string;
  stock: number;
}

// export type OrderItem = {
//   productId: string;
//   photo: string;
//   name: string;
//   price: string;
//   quantity: string;
//   _id: string;
// }

export type OrderItem = Omit<CartItem, "stock"> & {_id: string};

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};