export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};

export type Product = {
  name: string;
  price: number;
  stock: number;
  category: string;
  photo: string;
  _id: string;
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};

export type CartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

// export type OrderItem = {
//   productId: string;
//   photo: string;
//   name: string;
//   price: string;
//   quantity: string;
//   _id: string;
// }

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

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

type PercentAndCountChange = {
  revenue: number;
  users: number;
  products: number;
  orders: number;
};

export type LatestTransactionType = {
  _id: string;
  discount: number;
  amount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  categories: string[];
  categoriesCount: number[];
  categoryCount: Record<string, number>[];
  percentChange: PercentAndCountChange;
  count: PercentAndCountChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  usersGenderRatio: {
    male: number;
    female: number;
  };
  modifiedLatestTransactions: LatestTransactionType[];
};

export type PieChart = {
  orderFullfillment: {
    processing: number;
    shipped: number;
    delivered: number;
};
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
  };
  adminCustomers: {
    admin: number;
    customer: number;
  };
  usersAgeGroup: {
    teen: number;
    adult: number;
    old: number;
  };
  allAdminUsers: number;
  allCustomerUsers: number;
};


export type BarChart = {
  users: number[];
  products: number[];
  orders: number[];
}

export type LineChart = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
}