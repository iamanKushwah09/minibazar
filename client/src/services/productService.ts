import api from './api';
import { Product } from '../types';

const mapProductPrices = (product: any): Product => {
  if (!product) return product;
  
  const salePrice = product.sale_price || product.prices?.price || 0;
  // Use customerPrice as MRP if available (backend maps MRP to customerPrice in store API)
  const mrp = product.mrp || product.prices?.customerPrice || product.prices?.originalPrice || salePrice;

  return {
    ...product,
    prices: {
      price: salePrice,
      originalPrice: mrp,
    }
  };
};

export class ProductService {
  // Get products showing on the home page
  static async getShowingProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/show');
    return response.data.map(mapProductPrices);
  }

  // Get products for the store with filters
  static async getStoreProducts(params: {
    category?: string;
    itemgroup?: string;
    title?: string;
    slug?: string;
    query?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; totalDoc: number }> {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.itemgroup) queryParams.append('itemgroup', params.itemgroup);
    if (params.title) queryParams.append('title', params.title);
    if (params.slug) queryParams.append('slug', params.slug);
    if (params.query) queryParams.append('query', params.query);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get<any>(`/products/store?${queryParams.toString()}`);
    return {
      ...response.data,
      products: (response.data.products || []).map(mapProductPrices)
    };
  }

  // Get a single product by slug
  static async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get<Product>(`/products/product/${slug}`);
    return mapProductPrices(response.data);
  }

  // Get search suggestions
  static async getSearchSuggestions(query: string): Promise<{
    suggestions: any[];
    categories: any[];
    itemGroups: any[];
  }> {
    const response = await api.get<any>(`/products/suggestions?query=${query}`);
    const data = response.data || {};
    return {
      suggestions: (data.suggestions || []).map(mapProductPrices),
      categories: data.categories || [],
      itemGroups: data.itemGroups || [],
    };
  }

  // Get discounted products
  static async getDiscountedProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/discount');
    return response.data.map(mapProductPrices);
  }
}

export default ProductService;
