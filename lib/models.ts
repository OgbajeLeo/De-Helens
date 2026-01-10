export interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: 'shawama' | 'drinks' | 'food' | 'protein';
  image?: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  _id?: string;
  customerName: string;
  customerPhone: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  landmark?: string;
  deliveryFee?: number;
  subtotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'delivered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Admin {
  _id?: string;
  username: string;
  password: string;
  createdAt?: Date;
}
