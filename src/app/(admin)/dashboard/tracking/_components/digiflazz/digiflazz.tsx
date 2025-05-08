'use client'

import { Button } from '@/components/ui/button';
import { CLIENT_DIGI_KEY, CLIENT_DIGI_USERNAME, DIGI_KEY, DIGI_USERNAME } from '@/constants';
import { Digiflazz } from '@/lib/digiflazz';
import { Wallet, ListChecks, Search } from 'lucide-react';

export function DigiflazzPage() {
  const digiflazz = new Digiflazz(CLIENT_DIGI_USERNAME,CLIENT_DIGI_KEY)
    const options = [
    { name: 'Cek Saldo', icon: Wallet },
    { name: 'Cek Transaksi', icon: ListChecks },
    { name: 'Cek Status', icon: Search },
  ];

    
  const handleClick = async (option: string) => {
      if (option === 'Cek Saldo') {
        const data = await digiflazz.checkDeposit()
          console.log('Cek Saldo', data
          
      );
    } else if(option === 'Cek Transaksi') {
      console.log('Cek Transaksi');
    } else if(option === 'Cek Status') {
      console.log('Cek Status');
    }
  };

  return (
    <section className="w-full p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Pilih Menu Digiflazz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              onClick={() => handleClick(item.name)}
              className="flex items-center justify-start w-full space-x-4 bg-card text-white p-4 rounded-lg text-left shadow-lg transition-all"
            >
              <Icon className="w-6 h-6" />
              <span className="text-lg font-semibold">{item.name}</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
