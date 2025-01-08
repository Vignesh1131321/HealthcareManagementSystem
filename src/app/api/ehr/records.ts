// Example Next.js API route (/api/ehr/records.ts)
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { authToken } = req.headers;

    const ehrResponse = await axios.get("https://ehr-api.example.com/records", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    res.status(200).json(ehrResponse.data);
  } catch (error) {
    console.error("EHR API error:", error);
    res.status(500).json({ message: "Failed to fetch health records" });
  }
}
