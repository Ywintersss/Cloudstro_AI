import { NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const command = new InvokeModelCommand({
            modelId: "anthropic.claude-v2", // change if needed
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({ prompt }),
        });

        const response = await bedrock.send(command);
        const output = Buffer.from(response.body).toString("utf-8");

        return NextResponse.json({ answer: output });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
