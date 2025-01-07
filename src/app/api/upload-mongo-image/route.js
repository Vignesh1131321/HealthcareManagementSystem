import mongoose from "mongoose";
import { Image } from "../../../models/image";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const data = await request.formData();

        const file = data.get("file");
        const userId = data.get("userId"); // Get the userId from the request

        if (!file || !userId) {
            return NextResponse.json({ success: false, error: "File or userId missing" });
        }

        const bufferData = await file.arrayBuffer();
        const buffer = Buffer.from(bufferData);

        const newImage = new Image({
            name: file.name,
            data: buffer,
            contentType: file.type,
            userId,
        });
        await newImage.save();

        return NextResponse.json({ response: "Successfully Uploaded", success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Upload failed" });
    }
};
