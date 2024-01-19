import { z } from "zod";

import axios from "axios";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
type saveToS3Return = {
  s3Url: string;
  imageKey: string;
};
const saveToS3 = async (url: string): Promise<saveToS3Return> => {
  const credentials = {
    accessKeyId: process.env.ACCESS_KEY ?? "",
    secretAccessKey: process.env.SECRET_KEY ?? "",
  };
  const region = process.env.REGION ?? "";
  const bucket = process.env.BUCKET_NAME ?? "";

  const s3Config = {
    credentials: credentials,
    region: region,
  };

  const s3 = new S3Client(s3Config);

  try {
    // Fetch the image from the URL
    const imageUrl = url;
    const imageResponse = await axios({
      method: "get",
      url: imageUrl,
      responseType: "arraybuffer", // Specify arraybuffer to receive binary data
    });

    // Convert the arraybuffer to a Buffer
    const imageBuffer = Buffer.from(imageResponse.data as Buffer);

    // Set the key for the S3 object (e.g., file name)
    const key = `${Date.now()}.png`;

    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: imageBuffer,
      ContentLength: imageBuffer.length,
      ContentType: "image/png", // Use "image/png" for PNG images
    };

    await s3.send(new PutObjectCommand(uploadParams));

    //TODO: Put Prisma Code Here.

    const expiresIn = 3600;
    const signedUrl = await (
      getSignedUrl as (
        client: S3Client,
        command: GetObjectCommand,
        options: { expiresIn: number },
      ) => Promise<string>
    )(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn });
    console.log(`s3Url: ${signedUrl}, imageKey: ${key}`);
    return { s3Url: signedUrl, imageKey: key };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return {
      s3Url: "",
      imageKey: "",
    };
  }
};
export const historyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        prompt: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log("history: create called");
      const { s3Url, imageKey } = await saveToS3(input.url);
      await ctx.db.history.create({
        data: {
          authorId: ctx.session.user.id,
          imageKey: imageKey,
          prompt: "some prompt for now",
        },
      });
      console.log("finished");
      return s3Url;
    }),
  view: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        id: z.string(),
        limit: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { cursor, id, limit } = input;
      type historyWithURL = {
        id: number;
        prompt: string;
        authorId: string;
        imageKey: string;
        userId: string | null;
        imageURL: string | null;
      }[];
      const history = (await ctx.db.history.findMany({
        take: limit + 1,
        skip: 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          authorId: id,
        },
      })) as historyWithURL;

      let nextCursor: typeof cursor | undefined = undefined;

      if (history.length > limit) {
        const nextItem = history.pop();
        if (nextItem != null) {
          nextCursor = nextItem.id;
        }
      }

      console.log(nextCursor);

      const credentials = {
        accessKeyId: process.env.ACCESS_KEY ?? "",
        secretAccessKey: process.env.SECRET_KEY ?? "",
      };
      const region = process.env.REGION ?? "";
      const bucket = process.env.BUCKET_NAME ?? "";

      const s3Config = {
        credentials: credentials,
        region: region,
      };
      const s3 = new S3Client(s3Config);

      const expiresIn = 3600;
      await Promise.all(
        history.map(async (h) => {
          const signedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket: bucket, Key: h.imageKey }),
            {
              expiresIn,
            },
          );
          h.imageURL = signedUrl;
        }),
      );

      return { history, nextCursor };
    }),
  getImageUrls: protectedProcedure
    .input(
      z.object({
        keys: z.string().array(),
      }),
    )
    .mutation(async ({ input }) => {
      const keys = input.keys;

      const credentials = {
        accessKeyId: process.env.ACCESS_KEY ?? "",
        secretAccessKey: process.env.SECRET_KEY ?? "",
      };
      const region = process.env.REGION ?? "";
      const bucket = process.env.BUCKET_NAME ?? "";

      const s3Config = {
        credentials: credentials,
        region: region,
      };
      const s3 = new S3Client(s3Config);

      const expiresIn = 3600;
      const urls: string[] = [];
      await Promise.all(
        keys.map(async (key) => {
          const signedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket: bucket, Key: key }),
            {
              expiresIn,
            },
          );

          urls.push(signedUrl);
        }),
      );

      return urls;
    }),
  getImageUrl: protectedProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const key = input.key;

      const credentials = {
        accessKeyId: process.env.ACCESS_KEY ?? "",
        secretAccessKey: process.env.SECRET_KEY ?? "",
      };
      const region = process.env.REGION ?? "";
      const bucket = process.env.BUCKET_NAME ?? "";

      const s3Config = {
        credentials: credentials,
        region: region,
      };
      const s3 = new S3Client(s3Config);

      const expiresIn = 3600;
      const urls: string[] = [];

      const signedUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: bucket, Key: key }),
        {
          expiresIn,
        },
      );

      return signedUrl;
    }),
});
