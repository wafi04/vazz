import axios from "axios";
// Create a Fonnte client
const fonteClient = {
  sendWhatsAppMessage: async ({
    to,
    message,
  }: {
    to: string;
    message: string;
    type: string;
  }) => {
    const formData = new FormData();
    formData.append("target", to);
    formData.append("message", message);
    formData.append("countryCode", "62");

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.fonnte.com/send",
        headers: {
          Authorization: "RjaXY87#+gXTBojDHVkZ",
        },
        data: formData,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
