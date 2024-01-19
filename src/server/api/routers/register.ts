import { z } from "zod";
import { randomUUID } from "crypto";
import formData from "form-data";
import Mailgun from "mailgun.js";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const registerRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!user) {
        console.log("no user found");
        return;
      }
      if (true) {
        await ctx.db.user.update({
          where: {
            email: input.email,
          },
          data: {
            password: input.password,
            emailVerified: true,
          },
        });
        return user.id;
      }
    }),
  sendVerification: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const email = input.email;
        let user = await ctx.db.user.findFirst({
          where: {
            email: email,
          },
        });
        if (!user) {
          await ctx.db.user.create({
            data: {
              name: email,
              email: email,
            },
          });
          user = await ctx.db.user.findFirst({
            where: {
              email: email,
            },
          });
        }
        const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, "");
        await ctx.db.verificationToken.create({
          data: {
            token: token,
            userId: user!.id,
          },
        });

        const mailgun = new Mailgun(formData);
        const client = mailgun.client({
          username: "api",
          key: process.env.MAIL_GUN_KEY!,
        });
        const messageData = {
          from: "LogoAI <noreply@logoAI.io>",
          to: `${email}`,
          subject: "Email Verification",
          text: `Validate your account by clicking on this link: http://logo-ai.app/activate/${token}`,
        };

        await client.messages.create(process.env.MAIL_GUN_DOMAIN!, messageData);
      } catch (error) {
        console.log(`Send Verification Error`);
        console.log(error);
      }
    }),
});

// const saveToS3 = (url: string) => {};
// import { NextResponse } from "next/server";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(

//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const credentials = {
//     accessKeyId: process.env.ACCESS_KEY ?? "",
//     secretAccessKey: process.env.SECRET_KEY ?? "",
//   };
//   const region = process.env.REGION ?? "";
//   const bucket = process.env.BUCKET_NAME ?? "";

//   if (
//     !credentials.accessKeyId ||
//     !credentials.secretAccessKey ||
//     !region ||
//     !bucket
//   ) {
//     res.status(500).json({ error: "AWS Config Error" });
//   }

//   const s3Config = {
//     credentials: credentials,
//     region: region,
//   };
//   const s3 = new S3Client(s3Config);
//   const command = new GetObjectCommand({ Bucket: bucket, Key: "DALL-E.png" });

//   try {
//     const expiresIn = 3600; // Set your desired expiration time in seconds

//     // Explicitly assert the type of getSignedUrl
//     const signedUrl = await (
//       getSignedUrl as (
//         client: S3Client,
//         command: GetObjectCommand,
//         options: { expiresIn: number },
//       ) => Promise<string>
//     )(s3, command, { expiresIn });

//     res.status(200).json({
//       url: signedUrl,
//     });
//   } catch (error) {
//     console.error("Error generating signed URL:", error);
//     return res.status(500).json({
//       error: "Internal Server Error",
//     });
//   }
// }
