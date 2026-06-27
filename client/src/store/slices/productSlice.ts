import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';
import ItemGroupService from '../../services/itemGroupService';
import { Product, Category, ItemGroup } from '../../types';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  itemGroups: ItemGroup[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  selectedCategories: string[];
  selectedSubCategory: string;
  selectedItemGroups: string[];
  searchQuery: string;
  // Pagination
  page: number;
  limit: number;
  totalDoc: number;
  hasMore: boolean;
  // Legacy single-value fields kept for compatibility
  selectedCategory: string; 
  selectedItemGroup: string;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  categories: [],
  itemGroups: [],
  loading: false,
  loadingMore: false,
  error: null,
  selectedCategories: [],
  selectedSubCategory: 'all',
  selectedItemGroups: [],
  searchQuery: '',
  page: 1,
  limit: 12,
  totalDoc: 0,
  hasMore: true,
  selectedCategory: 'all',
  selectedItemGroup: 'all',
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ append = false }: { append?: boolean } = {}, { getState }) => {
    const state = getState() as { products: ProductState };
    const { selectedCategories, selectedItemGroups, searchQuery, page, limit } = state.products;
    
    const currentPage = append ? page + 1 : 1;
    
    const category = selectedCategories.length > 0 ? selectedCategories.join(',') : '';
    const itemgroup = selectedItemGroups.length > 0 ? selectedItemGroups.join(',') : '';
    const query = searchQuery;

    const response = await ProductService.getStoreProducts({
      category,
      itemgroup,
      query,
      page: currentPage,
      limit,
    });
    
    return {
      products: response.products || [],
      totalDoc: response.totalDoc || 0,
      page: currentPage,
      append
    };
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    return await CategoryService.getShowingCategories();
  }
);

export const fetchItemGroups = createAsyncThunk(
  'products/fetchItemGroups',
  async () => {
    return await ItemGroupService.getActiveItemGroups();
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (id === 'all') {
        state.selectedCategories = [];
        state.selectedCategory = 'all';
      } else {
        const index = state.selectedCategories.indexOf(id);
        if (index >= 0) {
          state.selectedCategories.splice(index, 1);
        } else {
          state.selectedCategories.push(id);
        }
        state.selectedCategory = state.selectedCategories.length > 0 ? state.selectedCategories[0] : 'all';
      }
      state.selectedSubCategory = 'all';
      state.page = 1;
      state.hasMore = true;
    },
    toggleItemGroup: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (id === 'all') {
        state.selectedItemGroups = [];
        state.selectedItemGroup = 'all';
      } else {
        const index = state.selectedItemGroups.indexOf(id);
        if (index >= 0) {
          state.selectedItemGroups.splice(index, 1);
        } else {
          state.selectedItemGroups.push(id);
        }
        state.selectedItemGroup = state.selectedItemGroups.length > 0 ? state.selectedItemGroups[0] : 'all';
      }
      state.page = 1;
      state.hasMore = true;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategories = action.payload === 'all' ? [] : [action.payload];
      state.selectedCategory = action.payload;
      state.selectedSubCategory = 'all';
      state.page = 1;
      state.hasMore = true;
    },
    setItemGroup: (state, action: PayloadAction<string>) => {
      state.selectedItemGroups = action.payload === 'all' ? [] : [action.payload];
      state.selectedItemGroup = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    setSubCategory: (state, action: PayloadAction<string>) => {
      state.selectedSubCategory = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
    clearFilters: (state) => {
      state.selectedCategories = [];
      state.selectedItemGroups = [];
      state.selectedCategory = 'all';
      state.selectedItemGroup = 'all';
      state.selectedSubCategory = 'all';
      state.searchQuery = '';
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        if (action.meta.arg?.append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        
        if (action.payload.append) {
          state.products = [...state.products, ...action.payload.products];
        } else {
          state.products = action.payload.products;
        }
        
        state.filteredProducts = state.products;
        state.totalDoc = action.payload.totalDoc;
        state.page = action.payload.page;
        state.hasMore = state.products.length < state.totalDoc;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchItemGroups.fulfilled, (state, action) => {
        state.itemGroups = action.payload;
      });
  },
});

export const { 
  toggleCategory, 
  toggleItemGroup, 
  setCategory,
  setItemGroup,
  setSubCategory,
  setSearchQuery, 
  clearFilters 
} = productSlice.actions;
export default productSlice.reducer;
