export const URL_LOGO =
  "https://res.cloudinary.com/dstvymie8/image/upload/v1741104560/LOGO_VAZZ_STORE_2_dereyt.webp";
export const CATEGORIES_QUERY_KEY = ["categories"] as const;
export const STEPS = { PRODUCT_SELECTION: 1, ORDER_DETAILS: 2 };
export const DEFAULT_CATEGORY = 23;
export const DEBOUNCE_DELAY = 500;
export const LAYANAN_PER_PAGE = 100;
export const TAX_RATE = 0.007;
export const MINIMUM_CUSTOM_AMOUNT = 1;

export const NOMINAL_OPTIONS = [
  { value: "50000", label: "Rp 50.000" },
  { value: "100000", label: "Rp 100.000" },
  { value: "200000", label: "Rp 200.000" },
  { value: "500000", label: "Rp 500.000" },
  { value: "1000000", label: "Rp 1.000.000" },
] as const;

export const PAYMENT_METHODS = [
  { value: "virtual-account", label: "Virtual Account", icon: "🏦" },
  { value: "e-wallet", label: "E-Wallet", icon: "💳" },
  { value: "qris", label: "QRIS", icon: "📱" },
] as const;

export type PaymentMethodCode = (typeof PAYMENT_METHODS)[number]["value"];

export type BankMethod = {
  code: string;
  name: string;
};
/*
  ... 
  @params Crendentials api key

*/

export const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

/*
  ...
  @params  Credentials DIGIFLAZZ
  ...
*/
export const DIGI_USERNAME = process.env.DIGI_USERNAME as string;
export const DIGI_KEY = process.env.DIGI_API_KEY as string;
export const TYPE_TRANSACTION = "TOPUP" || "MEMBERSHIP" || "DEPOSIT";
export const CLIENT_DIGI_USERNAME = process.env
  .NEXT_PUBLIC_DIGI_USERNAME as string;
export const CLIENT_DIGI_KEY = process.env.NEXT_PUBLIC_DIGI_API_KEY as string;

/*
  ...
  @params  Credentils DUITKU
  ...
*/
export const DUITKU_MERCHANT_CODE =
  process.env.DUITKU_MERCHANT_CODE ||
  process.env.NEXT_PUBLIC_DUITKU_MERCHANT_CODE;
export const DUITKU_EMAIL =
  process.env.DUTKU_EMAIL || process.env.NEXT_PUBLIC_DUITKU_EMAIL;
export const DUITKU_API_KEY =
  process.env.DUITKU_API_KEY || process.env.NEXT_PUBLIC_DUITKU_API_KEY;
export const DUITKU_BASE_URL =
  process.env.DUITKU_BASE_URL || process.env.NEXT_PUBLIC_DUITKU_BASE_URL;
export const DUITKU_CALLBACK_URL =
  process.env.NEXT_PUBLIC_DUITKU_CALLBACK_URL ||
  process.env.DUITKU_CALLBACK_URL;
export const DUITKU_RETURN_URL =
  process.env.NEXT_PUBLIC_DUITKU_RETURN_URL || process.env.DUITKU_RETURN_URL;
export const DUITKU_EXPIRY_PERIOD = 60 * 24;
