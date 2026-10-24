import { z } from "zod";

/** GET /ask query params (https://hangingcontext.com/openapi.json). */
export const zHangingContextAskQueryParams = z.object({
    query: z.string().min(1).max(500).describe(
        "The question, in plain words. Example: 'What did central banks " +
            "say this week?'.",
    ),
}).strict();
