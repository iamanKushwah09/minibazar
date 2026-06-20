export interface LocalizedString {
  en?: string;
  hi?: string;
  [key: string]: string | undefined;
}

export interface Product {
  _id: string;
  title: LocalizedString | string;
  description?: LocalizedString | string;
  slug: string;
  sku?: string;
  barcode?: string;
  image: string[];
  stock: number;
  prices: {
    price: number;
    originalPrice: number;
    discount?: number;
  };
  categories: string[];
  category: string;
  tag?: string[];
  status: 'show' | 'hide';
  isCombination: boolean;
  variants?: { quantity?: string; price: number; selling_price: number; stock: number; [key: string]: any }[];
  unit?: string;
  item_group_id?: string;
  unit_id?: string;
  conversion_factor?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ItemGroup {
  _id: string;
  name: string;
  code?: string;
  alias?: string;
  image?: string;
  is_active: boolean;
  is_parent_group: boolean;
  parent_id?: string;
  children?: ItemGroup[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
}

export interface Category {
  _id: string;
  name: LocalizedString | string;
  description?: LocalizedString | string;
  slug: string;
  icon?: string;
  image?: string;
  status: 'show' | 'hide';
  parentId?: string;
  parentName?: string;
  children?: Category[];
} 