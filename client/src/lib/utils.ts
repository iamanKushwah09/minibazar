import { LocalizedString } from '../types';

export const showingTranslateValue = (data: LocalizedString | string | undefined, lang: string = 'en'): string => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  
  return data[lang] || data['en'] || Object.values(data)[0] || '';
};

export const getImageUrl = (image: any): string => {
  const uri = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5070/api";
  const baseUrl = uri.replace('/api', '');
  
  let rawImage = Array.isArray(image) ? image[0] : image;
  
  if (typeof rawImage === 'object' && rawImage !== null) {
      const extractedPath = rawImage.url || rawImage.path || rawImage.image_url;
      if (!extractedPath) {
          return '/placeholder.png';
      }
      rawImage = extractedPath;
  }

  if (!rawImage || typeof rawImage !== 'string') {
    return '/placeholder.png';
  }
  
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
    return rawImage;
  }
  
  return `${baseUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
};

export const getQuantityStep = (product: any): number => {
  if (product?.moq) return Number(product.moq);
  if (product?.conversion_factor) return Number(product.conversion_factor);
  return 1;
};

