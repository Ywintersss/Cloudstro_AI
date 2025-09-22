  import { NextResponse } from "next/server";
  import {
      SageMakerRuntimeClient,
      InvokeEndpointCommand,
  } from "@aws-sdk/client-sagemaker-runtime";
  import {
      BedrockRuntimeClient,
      InvokeModelCommand,
  } from "@aws-sdk/client-bedrock-runtime";

  // ---- CONFIG ----
  const DEFAULT_REGION = process.env.REGION_1 || "ap-southeast-1"; // fallback: Singapore
  const SAGEMAKER_REGION = process.env.REGION_2 || "ap-southeast-1"; // fallback: Singapore
  const BEDROCK_REGION = process.env.REGION_3 || "ap-southeast-1"; // fallback: Singapore
  const SAGEMAKER_ENDPOINT = process.env.SAGEMAKER_ENDPOINT!;

  // Clients
  const sagemakerClient = new SageMakerRuntimeClient({ region: SAGEMAKER_REGION });
  const bedrockClient = new BedrockRuntimeClient({  
    region: BEDROCK_REGION,
    credentials: {
      accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
    },
  });

// ---- HANDLER ----
export async function POST(req: Request) {
  console.log("Received request at /api/predict");
  console.log("Body:", req);
  try {
    const { features } = await req.json();
    console.log(features)
    if (!features) {
        return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

      // 1. Call SageMaker
      const predictionResults = await callSagemaker([features]);

      const rawPrediction = predictionResults.Body
        ? Buffer.from(predictionResults.Body as Uint8Array).toString()
        : "{}";

      // 2. Call Bedrock
      const bedrockResponse = await callBedrock(rawPrediction);

      const bedrockText = bedrockResponse.body
        ? Buffer.from(bedrockResponse.body as Uint8Array).toString()
        : "{}";

      // Parse the raw Bedrock response
      const bedrockJson = JSON.parse(bedrockText);

      // Extract only the text
      const explanationText =
        bedrockJson?.output?.message?.content?.[0]?.text || "";

      // return NextResponse.json({ prediction: JSON.parse(rawPrediction) });

      // 3. Return combined
      return NextResponse.json({
        prediction: JSON.parse(rawPrediction),
        explanation: explanationText,
      });
    } catch (err: any) {
      console.error("Error in /predict:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  

  // ---- HELPERS ----
  const callSagemaker = async (input: any) => {

    return await sagemakerClient.send(
      new InvokeEndpointCommand({
        EndpointName: SAGEMAKER_ENDPOINT,
        Body: Buffer.from(JSON.stringify(
          input
        )),
        ContentType: "application/json",
      })
    );
  };

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
