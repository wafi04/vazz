import { TemplateWaMessages } from "@/data/template/formatWaMessage";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function GET(req: Request) {
  try {
    // Using dummy data instead of request body
    const dummyData = {
      username: "Budi Gamer",
      productNameDisplay: "Mobile Legends",
      itemDetails: "275 Diamonds + 25 Bonus",
      formattedAmount: "75,000",
      timeLimit: "24 jam",
      linkDisplay: "https://payment.gamestore.com/order/ML123456",
      diamonds: "💎",
      phoneNumber: "6282226197047",
    };

    // Get message template from database
    const messageTemplate = await prisma.messages.findFirst({
      where: {
        title: "Pesanan Pending",
      },
    });

    if (!messageTemplate) {
      return Response.json(
        { error: "Message template not found" },
        { status: 404 }
      );
    }

    // Extract template and details
    const template = messageTemplate.text;
    const details = messageTemplate.details as Record<string, any>;

    // Replace placeholders in template using dummy data
    const separator = details?.separator || "━━━━━━━━━━━";

    const finalMessage = TemplateWaMessages({
      template,
      diamonds: "💎",
      formattedAmount: dummyData.formattedAmount,
      itemDetails: dummyData.itemDetails,
      linkDisplay: dummyData.linkDisplay,
      productNameDisplay: dummyData.productNameDisplay,
      separator,
      username: dummyData.username,
    });
    const payload = {
      number: dummyData.phoneNumber,
      message: finalMessage,
    };

    // Send message via WhatsApp API
    const response = await axios.post(
      "http://localhost:7000/whatsapp/tst/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    // Log successful send with dummy data info
    console.log("Message sent successfully:", {
      to: dummyData.phoneNumber,
      game: dummyData.productNameDisplay,
      amount: dummyData.formattedAmount,
      timestamp: new Date().toISOString(),
    });

    return Response.json({
      success: true,
      message: "Order notification sent successfully",
      data: {
        messageId: response.data?.id,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error sending order notification:", error);

    if (axios.isAxiosError(error)) {
      return Response.json(
        {
          error: "Failed to send WhatsApp message",
          details: error.response?.data || error.message,
        },
        { status: 500 }
      );
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
