export interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: 'meal' | 'drink';
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
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
}

export interface Admin {
  _id?: string;
  username: string;
  password: string;
  createdAt?: Date;
}
