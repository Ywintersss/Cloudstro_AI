import { NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const BEDROCK_REGION = process.env.REGION_3 || "ap-southeast-1"; // fallback: Singapore


const bedrockClient = new BedrockRuntimeClient({  
    region: BEDROCK_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
export async function POST(req: Request) {
    try {
        // const { prompt } = await req.json();

        const bedrockResponse = await callBedrock("Outpuut an Image of a cat");

        const bedrockText = bedrockResponse.body
            ? Buffer.from(bedrockResponse.body as Uint8Array).toString()
            : "{}";

        return NextResponse.json({ answer: bedrockResponse });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

const callBedrock = async (rawPrediction: any) => {
    return await bedrockClient.send(
      new InvokeModelCommand({
        modelId: process.env.BEDROCK_MODEL_INFERENCE_ARN, // swap if needed
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                {
                  // text: "Explain what is love in 20 words",
                  text: `Explain this model output in plain English: ${rawPrediction}, 
                  where the context of the output is the predicted engagement rate of the a 
                  social media platform based on past trends, dont have to show the entire 
                  rawPrediction whole value, up to 2 decimals would be fine, provide simple suggestions too`,  
                },
              ],
            },
          ],
          inferenceConfig: {
            maxTokens: 200,
            temperature: 0.7,
            topP: 0.9,
          },
        }),
      })
    );
  };