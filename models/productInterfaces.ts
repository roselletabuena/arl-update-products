export interface Variety {
  unit: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface Product {
  name: string;
  productId: string;
  totalQuantity: number;
  varieties: Variety[];
  description?: string;
}
