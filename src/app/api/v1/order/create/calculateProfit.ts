import { ProductData } from "@/types/product";

// Function dari sebelumnya
function hitungHarga(hargaDigi: number, profit: number, isFixed = true) {
  if (isFixed) {
    return hargaDigi + profit;
  } else {
    return hargaDigi + (hargaDigi * profit) / 100;
  }
}

function hitungProfitRupiah(hargaDigi: number, profit: number, isFixed = true) {
  if (isFixed) {
    return profit;
  } else {
    return Math.round((hargaDigi * profit) / 100);
  }
}

// Main function untuk calculate pricing
export function CalculatePricingWithProfitLogic(
  product: ProductData,
  userRole?: string
) {
  const {
    hargaFromDigi,
    profit,
    profitReseller,
    profitPlatinum,
    isProfitFixed,
    isFlashSale,
    hargaFlashSale,
    expiredFlashSale,
  } = product;

  // Cek apakah flash sale masih aktif
  const isFlashSaleActive =
    isFlashSale &&
    hargaFlashSale &&
    expiredFlashSale &&
    new Date() < new Date(expiredFlashSale);

  // Jika flash sale aktif, return harga flash sale
  if (isFlashSaleActive) {
    const profitFlashSale = hargaFlashSale! - hargaFromDigi;
    return {
      price: hargaFlashSale!,
      profit: profitFlashSale,
      profitRupiah: profitFlashSale,
      tier: "FLASH_SALE",
      isFlashSale: true,
      basePrice: hargaFromDigi,
    };
  }

  // Tentukan tier berdasarkan role user
  let selectedProfit: number;
  let tier: string;

  switch (userRole?.toUpperCase()) {
    case "Platinum":
      selectedProfit = profitPlatinum;
      tier = "Platinum";
      break;
    case "Reseller":
      selectedProfit = profitReseller;
      tier = "Reseller";
      break;
    case "Member":
      selectedProfit = profit;
      tier = "Member";
      break;
    case "USER":
    default:
      selectedProfit = profit;
      tier = "REGULAR";
      break;
  }

  // Hitung harga dan profit
  const finalPrice = hitungHarga(hargaFromDigi, selectedProfit, isProfitFixed);
  const profitRupiah = hitungProfitRupiah(
    hargaFromDigi,
    selectedProfit,
    isProfitFixed
  );

  return {
    price: finalPrice,
    profit: selectedProfit,
    profitRupiah: profitRupiah,
    tier: tier,
    isFlashSale: false,
    basePrice: hargaFromDigi,
    profitType: isProfitFixed ? "FIXED" : "PERCENTAGE",
  };
}

// Alternative function jika ingin lebih detail
export function CalculatePricingWithDetails(
  product: ProductData,
  userRole?: string
) {
  const pricing = CalculatePricingWithProfitLogic(product, userRole);

  // Hitung semua tier untuk comparison
  const allTiers = {
    regular: {
      price: hitungHarga(
        product.hargaFromDigi,
        product.profit,
        product.isProfitFixed
      ),
      profit: hitungProfitRupiah(
        product.hargaFromDigi,
        product.profit,
        product.isProfitFixed
      ),
    },
    reseller: {
      price: hitungHarga(
        product.hargaFromDigi,
        product.profitReseller,
        product.isProfitFixed
      ),
      profit: hitungProfitRupiah(
        product.hargaFromDigi,
        product.profitReseller,
        product.isProfitFixed
      ),
    },
    platinum: {
      price: hitungHarga(
        product.hargaFromDigi,
        product.profitPlatinum,
        product.isProfitFixed
      ),
      profit: hitungProfitRupiah(
        product.hargaFromDigi,
        product.profitPlatinum,
        product.isProfitFixed
      ),
    },
  };

  let flashSaleInfo = null;
  if (
    product.isFlashSale &&
    product.hargaFlashSale &&
    product.expiredFlashSale
  ) {
    const isActive = new Date() < new Date(product.expiredFlashSale);
    flashSaleInfo = {
      isActive,
      price: product.hargaFlashSale,
      profit: product.hargaFlashSale - product.hargaFromDigi,
      expiredAt: product.expiredFlashSale,
    };
  }

  return {
    ...pricing,
    allTiers,
    flashSaleInfo,
    discount: {
      fromRegular: allTiers.regular.price - pricing.price,
      percentage:
        ((allTiers.regular.price - pricing.price) / allTiers.regular.price) *
        100,
    },
  };
}
