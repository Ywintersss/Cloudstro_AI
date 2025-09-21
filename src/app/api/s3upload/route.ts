import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.REGION_1 });

export async function POST(req: Request) {
    try {
        const { fileName, content } = await req.json();
        const buffer = Buffer.from(content, "base64"); // assuming base64 input

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: fileName,
                Body: buffer,
            })
        );

        return NextResponse.json({ message: "File uploaded successfully" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
