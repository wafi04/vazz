"use client"
import { CreditCard, Truck, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { DigiflazzPage } from './digiflazz/digiflazz';

export function OthersPage() {
    const data = [
    {
      name: 'Digiflazz',
      path: '/dashboard/tracking?type=digiflazz',
      icon: CreditCard,
    },
    {
      name: 'Duitku',
      path: '/dashboard/tracking?type=duitku',
      icon: DollarSign,
    },
    {
      name: 'Tracking',
      path: '/dashboard/tracking?type=tracking',
      icon: Truck,
    },
  ];

    const searchParams = useSearchParams() ?? undefined
    const type = searchParams?.get('type')
    return (
        <>
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => {
            const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.path}
              className="flex items-center p-4 space-x-4 bg-blue-800 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              <div className="bg-blue-600 p-3 rounded-full">
                <Icon className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-300">Go to {item.name}</p>
              </div>
            </Link>
          );
        })}

      </section>
            {
              type === 'digiflazz' && <DigiflazzPage />
            }
        
        </>
    )
}