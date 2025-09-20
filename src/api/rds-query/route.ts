import { NextResponse } from "next/server";
import { RDSDataClient, ExecuteStatementCommand } from "@aws-sdk/client-rds-data";

const rds = new RDSDataClient({ region: process.env.AWS_REGION });

export async function POST(req: Request) {
    try {
        const { sql } = await req.json();

        const command = new ExecuteStatementCommand({
            resourceArn: process.env.RDS_CLUSTER_ARN!,
            secretArn: process.env.RDS_SECRET_ARN!,
            database: process.env.RDS_DATABASE!,
            sql,
        }); 

        const result = await rds.send(command);
        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
