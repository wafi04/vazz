import { JSX } from 'react';
import { Metadata } from 'next';
import DetailsCategories from './_components/details';

export  const metadata : Metadata = {
  title : "Order - Vazzuniverse",
  description  : 'Vazzuniverse adalah sebuah penyedia layanan top up games dengan harga termurah dan proses super instan. Dapatkan lebih banyak promo dan potongan harga dengan cara bergabung menjadi Reseller.'
}

export default function Page({params} : {params : {name : string | undefined}}) : JSX.Element {
  return (
    <>{
      params.name && (
        <DetailsCategories name={params.name} />
      )
    }
    </>
  );
}
