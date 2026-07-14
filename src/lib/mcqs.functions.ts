import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError, Output } from "ai";
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
          options: z.array(z.string()),
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

    const parseFallback = (text: string | undefined) => {
      if (!text) return [];
      const cleaned = text
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start < 0 || end <= start) return [];
      try {
        const parsed = JSON.parse(cleaned.slice(start, end + 1));
        const result = McqSchema.safeParse(parsed);
        return result.success ? result.data.mcqs : [];
      } catch {
        return [];
      }
    };

    const normalize = (items: z.infer<typeof McqSchema>["mcqs"]) =>
      items
        .map((item) => {
          const question = item.question.trim();
          const options = Array.from(
            new Set(item.options.map((option) => option.trim()).filter(Boolean)),
          ).slice(0, 4);
          if (!question || options.length !== 4) return null;
          const answer = options.includes(item.answer.trim()) ? item.answer.trim() : options[0];
          return {
            question,
            options,
            answer,
            explanation: item.explanation.trim() || "Review the standard UPSC source for this fact.",
            topic: item.topic.trim() || data.topic,
          };
        })
        .filter((item): item is z.infer<typeof McqSchema>["mcqs"][number] => Boolean(item));

    for (let i = 0; i < batches.length; i++) {
      const size = batches[i];
      const avoidCombined = [...avoidList, ...seenSoFar].slice(-60);
      const prompt = `Generate ${size} UPSC Prelims MCQs strictly focused on: "${data.topic}". Stay tightly on this topic/subtopic; do not drift. Each MCQ must have exactly 4 options in the options array, and answer must exactly match one option.${data.seed ? ` Variation seed: ${data.seed}-b${i} — produce a fresh batch.` : ""}${avoidCombined.length ? ` AVOID repeating or paraphrasing any of these previously-asked questions:\n- ${avoidCombined.join("\n- ")}` : ""}`;
      let rawBatch: z.infer<typeof McqSchema>["mcqs"] = [];
      try {
        const { output } = await generateText({
          model,
          maxOutputTokens: 6144,
          output: Output.object({ schema: McqSchema }),
          system:
            "You are a UPSC Prelims paper-setter. Generate rigorous, factually accurate UPSC Prelims-style MCQs. Return only the requested object shape. Keep explanations to 1-2 crisp lines.",
          prompt,
        });
        rawBatch = output.mcqs;
      } catch (error) {
        if (!NoObjectGeneratedError.isInstance(error)) throw error;
        rawBatch = parseFallback(error.text);
      }
      const batch = normalize(rawBatch);
      all.push(...batch);
      seenSoFar.push(...batch.map((m) => m.question));
    }

    return { mcqs: all };
  });
