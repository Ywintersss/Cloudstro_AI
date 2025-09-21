import { NextResponse } from "next/server";
import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";

const sm = new SageMakerRuntimeClient({ region: process.env.AWS_REGION });

export async function POST(req: Request) {
    try {
        const { input } = await req.json();

        const command = new InvokeEndpointCommand({
            EndpointName: process.env.SAGEMAKER_ENDPOINT!,
            Body: JSON.stringify(input),
            ContentType: "application/json",
        });

        const response = await sm.send(command);
        const body = new TextDecoder().decode(response.Body);

        return NextResponse.json({ prediction: JSON.parse(body) });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
