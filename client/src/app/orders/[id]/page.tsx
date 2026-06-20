import OrderDetailsView from './OrderDetailsView';

export function generateStaticParams() {
  return []; // Orders are private and dynamic, no need to pre-render
}

export default function OrderDetailsPage() {
  return <OrderDetailsView />;
}