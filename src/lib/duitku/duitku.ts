import axios from "axios";

export type DuitkuCreateTransactionParams = {
  paymentAmount: number;
  merchantOrderId: string;
  productDetails: string;
  paymentCode: string;
  cust?: string;
  noWa: string;
  baseUrl: string;
};

export class Duitku {
  private DUITKU_KEY: string;
  private DUITKU_MERCHANT_CODE: string;
  private DUITKU_CALLBACK_URL: string;
  private DUITKU_EXPIRY_PERIOD: number;
  private BASE_URL =
    "https://passport.duitku.com/webapi/api/merchant/v2/inquiry";

  constructor(
    duitkuKey: string,
    duitkuMerchantCode: string,
    duitkuCallbackUrl: string,
    duitkuExpiryPeriod: number = 10
  ) {
    this.DUITKU_KEY = duitkuKey;
    this.DUITKU_MERCHANT_CODE = duitkuMerchantCode;
    this.DUITKU_CALLBACK_URL = duitkuCallbackUrl;
    this.DUITKU_EXPIRY_PERIOD = duitkuExpiryPeriod;
  }

  private generateSignature(
    merchantCode: string,
    merchantOrderId: string,
    amount: number
  ): string {
    const crypto = require("crypto");
    const md5 = crypto
      .createHash("md5")
      .update(merchantCode + merchantOrderId + amount + this.DUITKU_KEY)
      .digest("hex");
    return md5;
  }

  async CreateTransaction({
    paymentAmount,
    merchantOrderId,
    productDetails,
    paymentCode,
    cust,
    noWa,
    baseUrl,
  }: DuitkuCreateTransactionParams) {
    try {
      // Generate signature
      const signature = this.generateSignature(
        this.DUITKU_MERCHANT_CODE,
        merchantOrderId,
        paymentAmount
      );
      const payload = {
        merchantCode: this.DUITKU_MERCHANT_CODE,
        paymentAmount: paymentAmount,
        merchantOrderId: merchantOrderId,
        productDetails: productDetails,
        paymentMethod: paymentCode,
        customerVaName: cust,
        phoneNumber: noWa,
        returnUrl: `${baseUrl}/invoice?invoice=${merchantOrderId}`,
        callbackUrl: this.DUITKU_CALLBACK_URL,
        signature: signature,
        expiryPeriod: this.DUITKU_EXPIRY_PERIOD,
      };

      // Make API request
      const response = await axios.post(this.BASE_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Parse response
      const data = await response.data;

      return {
        status: true,
        message: "Transaction created successfully",
        data: {
          ...data,
          merchantOrderId,
          signature,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        status: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create transaction",
        data: {
          merchantOrderId,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
