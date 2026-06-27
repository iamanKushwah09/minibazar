import api from './api';
import { Category } from '../types';

export class CategoryService {
  // Get all categories showing on the site
  static async getShowingCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories/show');
    return response.data;
  }
}

export default CategoryService;
