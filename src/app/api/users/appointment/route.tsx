import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Replace this with your actual Google Places API Key
const GOOGLE_PLACES_API_KEY = "AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const { placeId } = req.query;

  if (!placeId || typeof placeId !== "string") {
    return res.status(400).json({ error: "Invalid or missing placeId parameter." });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: GOOGLE_PLACES_API_KEY,
          fields: "reviews",
        },
      }
    );

    if (response.data && response.data.result) {
      const reviews = response.data.result.reviews || [];
      return res.status(200).json({ reviews });
    } else {
      return res.status(404).json({ error: "No reviews found for this place." });
    }
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
