import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ==========================
// GET ACCESS TOKEN
// ==========================
export const getAccessToken = async (): Promise<string> => {
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
    throw new Error("Mpesa consumer key or secret missing");
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    console.log("✅ Access token obtained successfully");
    return response.data.access_token;
  } catch (error: any) {
    console.error("Error getting access token:", error.response?.data || error.message);
    throw error;
  }
};

// ==========================
// FORMAT PHONE NUMBER
// ==========================
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Remove leading 0 or 254 if present, then add 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    cleaned = cleaned;
  } else if (cleaned.startsWith('+')) {
    cleaned = '254' + cleaned.substring(4);
  } else {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
};

// ==========================
// STK PUSH
// ==========================
export const stkPush = async (phone: string, amount: number, order_id: number) => {
  // Format phone number correctly
  const formattedPhone = formatPhoneNumber(phone);
  
  console.log(`📱 Initiating STK Push for phone: ${formattedPhone}, amount: ${amount}, order: ${order_id}`);

  // Get fresh token
  const token = await getAccessToken();
  
  console.log("🔑 Token obtained, proceeding with STK Push...");

  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  // Generate timestamp in correct format: YYYYMMDDHHMMSS
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);

  console.log(`⏰ Timestamp: ${timestamp}`);

  const shortcode = process.env.MPESA_SHORTCODE as string;
  const passkey = process.env.MPESA_PASSKEY as string;

  // Generate password
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
  
  console.log(`🔐 Password generated: ${password.substring(0, 20)}...`);

  // ✅ HARDCODED CALLBACK URL (temporary)
  const callbackUrl = "https://landowner-earache-hush.ngrok-free.dev/mpesa/callback";

  const requestBody = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount), // Ensure amount is integer
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackUrl,
    AccountReference: `ORDER-${order_id}`,
    TransactionDesc: "Laundry Payment",
  };

  console.log("📤 Request Body:", JSON.stringify(requestBody, null, 2));

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(" STK Push successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(" STK Push Error Details:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};