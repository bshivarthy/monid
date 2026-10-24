import { z } from "zod";

const TOPICS = [
    "artificial-intelligence",
    "research-science",
    "finance-investing",
    "business-podcasts",
    "health-biotech",
    "sports",
    "federal-government",
    "state-government",
    "energy-climate",
    "culture-media",
] as const;

/** GET /n/{topic}/index.json path params. The slugs are the `newsrooms`
 *  ids in /editions/latest.json (read 2026-10-24). */
export const zHangingContextTopicPathParams = z.object({
    topic: z.enum(TOPICS).describe(
        "Topic slug. Example: artificial-intelligence.",
    ),
}).strict();
