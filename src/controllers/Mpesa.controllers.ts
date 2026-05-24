import { Request, Response } from "express";
import { getAccessToken } from "../Services/Mpesa.Services";

export const testMpesaToken = async (req: Request, res: Response) => {
  try {
    const token = await getAccessToken();
    return res.status(200).json({ access_token: token });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get token", error });
  }
};