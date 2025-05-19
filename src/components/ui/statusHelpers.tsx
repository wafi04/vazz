export const getStatusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case "SUCCESS":
    case "COMPLETED":
      return "default";
    case "PENDING":
      return "secondary";
    case "FAILED":
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
};

export const getPaymentStatusVariant = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PAID":
    case "SUCCESS":
      return "default";
    case "PENDING":
      return "secondary";
    case "FAILED":
    case "EXPIRED":
      return "destructive";
    default:
      return "outline";
  }
};
