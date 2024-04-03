import OpenAI from "openai";
import axios from "axios";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const historySchema = z.object({
  role: z.string(),
  content: z.string(),
});

type historyType = {
  role: string;
  content: string;
};

export const generateRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("Generating...");

        const openai = new OpenAI({
          apiKey: process.env.OPENAI_KEY,
        });

        const response = await openai.images.generate({
          model: "dall-e-3",
          // prompt: prompt,
          size: "1024x1024",
          prompt: input.prompt,
          quality: "standard",
          n: 1,
        });

        const url: string = response.data[0]?.url ?? "";
        console.log(url);
        return url;
      } catch (error) {
        console.log(error);
        return error as string;
      }
    }),

  getPrompt: publicProcedure
    .input(z.array(historySchema))
    .mutation(async ({ input }) => {
      try {
        console.log("Getting Prompts");
        // const prompt = `a clean vector logo,with simple distinguishable lines, white background, with text "${input.name}", a color of ${input.themeColor}, in the style of ${input.style}, in the theme of ${input.theme}`;

        //then you'll ask another question and so forth. When you can, try to give the user options.
        //After the user and you have gone back and forth 4 times,

        const systemMessage = {
          role: "system",
          content: `You are inside a logo building app. You are trying make Dall-E 3 prompts that best fits the users needs. This prompt will be given to the Dall-E 3 api to create logos.
          You have to ask one question, the user will respond, 
          
          
          
          Respond with the final prompt(of type answer). Also, do not ask the same questions over and over.

          The format should be a json object. There's three types. 'text', 'select' and 'answer'.
          'text' : ask a user a question that can be answered with a short text input.
          'select':  ask a user a question that can be answered from the options you give.
          'answer': this isn't a question. It's going to be the final response you give after the five questions. It's the prompt we will be giving to dall-e-3.

          the format should like this:
          {
          type: 'text'|'select'|'answer'
          response: string //this is your response. either the question or the answer.
          options: string?[] //this is optional. if the type is select, this field must be present. It's the options you're giving the user as the answer. It should have 5 Items at max.
          }

          The prompt given to the dall-e-3 should always generate a single logo that is clean, simple, 'illustration-like',  'vector-like', 'svg-icon-like', 'solid-colors'. `,
        };

        const openai = new OpenAI({
          apiKey: process.env.OPENAI_KEY,
        });
        //@ts-expect-error openAI api acting weird

        const completion = await openai.chat.completions.create({
          messages: [systemMessage, ...input],
          model: "gpt-4-1106-preview",
          response_format: { type: "json_object" },
        });
        const answer = (await JSON.parse(
          completion.choices[0]?.message.content ?? "",
        )) as response;
        console.log(answer);
        return answer;
      } catch (error) {
        console.log(error);
      }
    }),
});

type response = {
  type: string;
  response: string;
  options?: string[];
};
