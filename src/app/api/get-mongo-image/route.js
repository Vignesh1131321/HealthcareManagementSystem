import mongoose from "mongoose";
import { Image } from "../../../models/image";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const userId = request.headers.get("userId"); // Pass userId in the request header
        if (!userId) {
            return NextResponse.json({ success: false, error: "UserId missing" });
        }

        const images = await Image.find({ userId }).select("name data contentType");

        return NextResponse.json({ success: true, images });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Failed to fetch images" });
    }
};
