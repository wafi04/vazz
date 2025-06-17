export function GenerateMerchantOrderID(depositId: number, userId: number) {
  // Use both deposit ID and user ID for uniqueness
  return `DEP-${userId}-${depositId}-${Date.now()}`;
}

export function getWIBTime() {
  const now = new Date();
  const wibString = now.toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  return new Date(wibString);
}
