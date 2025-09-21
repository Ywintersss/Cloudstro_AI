import { NextResponse } from "next/server";
import { RDSDataClient, ExecuteStatementCommand } from "@aws-sdk/client-rds-data";

import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import mysql from "mysql2/promise";

const rdsAuroraClient = new RDSDataClient({ region: process.env.REGION_1 });

export async function GET(req: Request) {
    try {
        const rows = await queryDB("SELECT NOW() AS currentTime");

        return NextResponse.json({ success: true, rows });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}

export async function POST(req: Request) {
    try {
        // const secrets = await getSecrets();
        testConnection();
        const { sql } = await req.json();

        const command = new ExecuteStatementCommand({
            resourceArn: process.env.RDS_CLUSTER_ARN!,
            secretArn: process.env.RDS_SECRET_ARN!,
            database: process.env.RDS_DATABASE!,
            sql,
        }); 

        const result = await rdsAuroraClient.send(command);
        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

const getSecrets = async () => {
    const secret_name = "rds!cluster-ee5d8aa6-883e-440c-870d-1104c75e0c29";

    const client = new SecretsManagerClient({
    region: "ap-southeast-5",
    });

    let response;

    try {
        response = await client.send(
            new GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
    );
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }

    const secret = response.SecretString;
    return secret
};

const queryDB = async (sql: string) => {
    const command = new ExecuteStatementCommand({
        resourceArn: process.env.AURORA_RDS_ARN!, // Aurora cluster ARN
        secretArn: "cloudstro123",   // Secrets Manager ARN
        database: process.env.DB_NAME!,
        sql,
    });

    const result = await rdsAuroraClient.send(command);
    return result.records;
};

const testConnection = async () => {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: "cloudstro",
            password: "cloudstro123",
            database: process.env.DB_NAME,
            port: 3306,
        });

        const [rows] = await conn.query("SELECT NOW() AS currentTime");
        await conn.end();

        return NextResponse.json({ success: true, rows });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
};