import ProductDetailView from './ProductDetailView';
import ProductService from '@/services/productService';

export async function generateStaticParams() {
  try {
    // Fetch products to pre-render. For static export, we need the slugs.
    const products = await ProductService.getShowingProducts();
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return [{ id: '1' }];
    }

    return products.map((product) => ({
      id: product.slug || product._id,
    }));
  } catch (error) {
    console.error('Error fetching products for generateStaticParams:', error);
    return [{ id: '1' }];
  }
}

export default function ProductDetailPage() {
  return <ProductDetailView />;
}