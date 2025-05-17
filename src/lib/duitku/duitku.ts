import axios from "axios";
import crypto from "crypto";

export type DuitkuCreateTransactionParams = {
  paymentAmount: number;
  merchantOrderId: string;
  productDetails: string;
  paymentCode: string;
  cust?: string;
  returnUrl?: string;
  noWa: string;
};

export type ResponseFromDuitkuCheckTransaction = {
  status: number;
  data: {
    merchantOrderId: string;
    reference: string;
    amount: string;
    fee: string;
    statusCode: string;
    statusMessage: string;
  };
};

export class Duitku {
  private DUITKU_KEY: string;
  private DUITKU_MERCHANT_CODE: string;
  private DUITKU_CALLBACK_URL?: string | undefined;
  private DUITKU_EXPIRY_PERIOD?: number;
  private BASE_URL =
    "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry";

  private BASE_URL_GET_TRANSACTION =
    "https://passport.duitku.com/webapi/api/merchant/transactionStatus";

  constructor(
    duitkuKey: string,
    duitkuMerchantCode: string,
    duitkuCallbackUrl?: string | undefined,
    duitkuExpiryPeriod?: number | undefined
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
    returnUrl,
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
        returnUrl,
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
  async GetTransaction({ merchantOrderId }: { merchantOrderId: string }) {
    // md5(merchantCode + merchantOrderId + apiKey).
    const sign = crypto
      .createHash("md5")
      .update(this.DUITKU_MERCHANT_CODE + merchantOrderId + this.DUITKU_KEY)
      .digest("hex");
    const payload = {
      merchantcode: this.DUITKU_MERCHANT_CODE,
      merchantOrderId,
      signature: sign,
    };
    const req = await axios.post<ResponseFromDuitkuCheckTransaction>(
      this.BASE_URL_GET_TRANSACTION,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return req.data;
  }
}
