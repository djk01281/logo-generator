import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const credentials = {
    accessKeyId: process.env.ACCESS_KEY ?? "",
    secretAccessKey: process.env.SECRET_KEY ?? "",
  };
  const region = process.env.REGION ?? "";
  const bucket = process.env.BUCKET_NAME ?? "";

  if (
    !credentials.accessKeyId ||
    !credentials.secretAccessKey ||
    !region ||
    !bucket
  ) {
    res.status(500).json({ error: "AWS Config Error" });
  }

  const s3Config = {
    credentials: credentials,
    region: region,
  };
  const s3 = new S3Client(s3Config);
  const command = new GetObjectCommand({ Bucket: bucket, Key: "DALL-E.png" });

  try {
    const expiresIn = 3600; // Set your desired expiration time in seconds

    // Explicitly assert the type of getSignedUrl
    const signedUrl = await (
      getSignedUrl as (
        client: S3Client,
        command: GetObjectCommand,
        options: { expiresIn: number },
      ) => Promise<string>
    )(s3, command, { expiresIn });

    res.status(200).json({
      url: signedUrl,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
