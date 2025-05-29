export interface TemplateWaMessagesProps {
  template: string;
  separator: string;
  username: string;
  productNameDisplay: string;
  itemDetails: string;
  formattedAmount: string;
  linkDisplay: string;
  diamonds: "💎";
  orderId?: string;
  gameUserId?: string;
  serverName?: string;
}

export function TemplateWaMessages({
  template,
  separator,
  diamonds,
  formattedAmount,
  itemDetails,
  linkDisplay,
  gameUserId,
  orderId,
  serverName,
  productNameDisplay,
  username,
}: TemplateWaMessagesProps) {
  const finalMessage = template
    .replace(/{separator}/g, separator)
    .replace(/{productNameDisplay}/g, productNameDisplay)
    .replace(/{itemDetails}/g, itemDetails)
    .replace(/{formattedAmount}/g, formattedAmount)
    .replace(/{username}/g, username)
    .replace(/{gameUserId}/g, gameUserId ?? "")
    .replace(/{serverName}/g, serverName ?? "")
    .replace(/{orderId}/g, orderId ?? "")
    .replace(/{diamonds}/g, diamonds)
    .replace(/{linkDisplay}/g, linkDisplay);

  return finalMessage;
}
