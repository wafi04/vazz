export const URL_LOGO =
  "https://res.cloudinary.com/dstvymie8/image/upload/v1741104560/LOGO_VAZZ_STORE_2_dereyt.webp";
export const CATEGORIES_QUERY_KEY = ["categories"] as const;

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
