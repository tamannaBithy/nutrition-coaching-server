const twilio = require("twilio");

/**
 * Sends an SMS message to the specified phone number using Twilio.
 * @param {string} phoneNumber - The phone number to send the SMS to.
 * @param {string} message - The message content.
 * @returns {Promise<object>} - A promise that resolves to an object containing status and message details.
 */
exports.sendSMSToPhone = async (phoneNumber, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    const client = twilio(accountSid, authToken);

    const isSmsSend = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    if (isSmsSend?.sid) {
      return {
        status: true,
        message: "SMS sent successfully!",
      };
    } else {
      return {
        status: false,
        message: "Failed to send SMS.",
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send SMS.");
  }
};

/**
 * Sends a WhatsApp message to the specified phone number using Twilio.
 * @param {string} phoneNumber - The phone number to send the WhatsApp message to.
 * @param {string} message - The message content.
 * @returns {Promise<string>} - A promise that resolves to a success message if the WhatsApp message is sent successfully.
 */
exports.sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_PHONE_NUMBER}`;

    const client = twilio(accountSid, authToken);

    const isWhatsAppMessageSent = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: `whatsapp:${phoneNumber}`,
    });

    if (isWhatsAppMessageSent?.sid) {
      return {
        status: true,
        message: "WhatsApp message sent successfully!",
      };
    } else {
      return {
        status: false,
        message: "Failed to send WhatsApp message.",
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send WhatsApp message.");
  }
};
