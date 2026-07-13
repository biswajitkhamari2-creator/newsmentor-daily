import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  topic: z.string().min(2).max(200),
  count: z.number().int().min(1).max(6).default(4),
});

export const generateMainsQuestions = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          questions: z.array(
            z.object({
              question: z.string(),
              marks: z.number().int(),
              wordLimit: z.number().int(),
              paper: z.string(),
              hint: z.string(),
              keyPoints: z.array(z.string()),
            }),
          ),
        }),
      }),
      system:
        "You are a UPSC Mains examiner. Generate rigorous, exam-style analytical mains questions in the UPSC style (analyze/critically examine/discuss/comment). Assign each to the correct GS paper (GS-I, GS-II, GS-III, GS-IV, or Essay). Marks are 10 or 15, word limits 150 or 250 respectively. Keep hints one sentence and key points as 3-5 concise bullets.",
      prompt: `Generate ${data.count} UPSC Mains questions on the topic: "${data.topic}". Mix mark weights and papers where relevant.`,
    });

    return output;
  });
