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
    const model = gateway("google/gemini-3-flash-preview");

    const McqSchema = z.object({
      mcqs: z.array(
        z.object({
          question: z.string(),
          options: z.array(z.string()).length(4),
          answer: z.string(),
          explanation: z.string(),
          topic: z.string(),
        }),
      ),
    });

    // Chunk into batches of 8 to stay well inside the model's structured-output budget.
    const CHUNK = 8;
    const total = data.count;
    const batches: number[] = [];
    for (let n = total; n > 0; n -= CHUNK) batches.push(Math.min(CHUNK, n));

    const avoidList = (data.avoid ?? []).slice(-40);
    const seenSoFar: string[] = [];
    const all: z.infer<typeof McqSchema>["mcqs"] = [];

    for (let i = 0; i < batches.length; i++) {
      const size = batches[i];
      const avoidCombined = [...avoidList, ...seenSoFar].slice(-60);
      const { output } = await generateText({
        model,
        maxOutputTokens: 4096,
        output: Output.object({ schema: McqSchema }),
        system:
          "You are a UPSC Prelims paper-setter. Generate rigorous, factually accurate UPSC Prelims-style MCQs with exactly 4 options each. The 'answer' field must be one of the option strings (verbatim). Keep explanations to 1-2 crisp lines.",
        prompt: `Generate ${size} UPSC Prelims MCQs strictly focused on: "${data.topic}". Stay tightly on this topic/subtopic; do not drift.${data.seed ? ` Variation seed: ${data.seed}-b${i} — produce a fresh batch.` : ""}${avoidCombined.length ? ` AVOID repeating or paraphrasing any of these previously-asked questions:\n- ${avoidCombined.join("\n- ")}` : ""}`,
      });
      const batch = output.mcqs;
      all.push(...batch);
      seenSoFar.push(...batch.map((m) => m.question));
    }

    return { mcqs: all };
  });
