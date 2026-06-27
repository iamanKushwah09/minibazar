'use client';

import { 
  ShoppingBagIcon, 
  BanknotesIcon, 
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
}

interface DashboardStatsProps {
  orders: Order[];
}

export default function DashboardStats({ orders }: DashboardStatsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  // Calculate stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const stats = [
    {
      name: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBagIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Spent',
      value: formatPrice(totalSpent),
      icon: BanknotesIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Delivered Orders',
      value: deliveredOrders,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Orders',
      value: pendingOrders,
      icon: TruckIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
