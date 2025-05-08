import { useOrderStore } from "@/hooks/user-order";
import { FormatPrice } from "@/utils/formatPrice";

export function CartDetails() {
  const { method, price,voucherCode, zone, userId, productDetails } = useOrderStore();

  if(!userId){
    return null
  }
  return (
    <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50">
      <h3 className="text-lg font-semibold text-white mb-4">Detail Order</h3>
      <div className="space-y-3 text-sm text-gray-300">
        <div className="flex justify-between">
          <span className="text-gray-400">User ID:</span>
          <span className="font-medium">{userId || "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Produk:</span>
          <span className="font-medium">{productDetails?.name || "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Metode Pembayaran:</span>
          <span className="font-medium">{method.name || "-"}</span>
        </div>

        {zone && (
          <div className="flex justify-between">
            <span className="text-gray-400">Zone:</span>
            <span className="font-medium">{zone}</span>
          </div>
        )}
        {voucherCode.trim() !== "" && (
          <div className="flex justify-between">
            <span className="text-gray-400">Voucher:</span>
            <span className="font-medium">{voucherCode}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-400">Harga:</span>
          <span className="font-semibold text-blue-400">
            {price > 0 ? FormatPrice(price) : "-"}
          </span>
        </div>
        
      </div>
    </div>
  );
}
