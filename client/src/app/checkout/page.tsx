'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';
import Header from '../../components/Header';
import CheckoutForm from '../../components/CheckoutForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [items.length, router]);

  // Show checkout form if cart has items
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CheckoutForm />
    </div>
  );
} 