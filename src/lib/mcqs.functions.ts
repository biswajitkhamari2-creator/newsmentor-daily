import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  topic: z.string().min(2).max(400).default("current affairs"),
  count: z.number().int().min(1).max(20).default(5),
  seed: z.string().max(80).optional(),
  avoid: z.array(z.string()).max(200).optional(),
});

export const generatePrelimsMcqs = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data ?? {}))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          mcqs: z.array(
            z.object({
              question: z.string(),
              options: z.array(z.string()).length(4),
              answer: z.string(),
              explanation: z.string(),
              topic: z.string(),
            }),
          ),
        }),
      }),
      system:
        "You are a UPSC Prelims paper-setter. Generate rigorous, factually accurate UPSC Prelims-style MCQs with exactly 4 options each. The 'answer' field must be one of the option strings (verbatim). Explanations must be 2-3 lines with the concept and elimination logic.",
      prompt: `Generate ${data.count} UPSC Prelims MCQs on: "${data.topic}". Mix subjects (Polity, Economy, Environment, S&T, IR, History, Geography) where the topic allows.`,
    });

    return output;
  });
