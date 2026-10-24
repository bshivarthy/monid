import { assert, assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const fixturesDir = fromFileUrl(new URL("./fixtures/", import.meta.url));
const noNet = Deno.permissions.querySync({ name: "net" }).state !==
    "granted";

Deno.test("hangingcontext#topic happy (recorded 2026-10-24): one topic, FREE settle", async () => {
    const unit = await testSealedUnit("hangingcontext#topic");
    const fixture = await loadFixture(`${fixturesDir}happy.json`);
    const result = await runEndpoint({
        unit,
        input: { pathParams: { topic: "artificial-intelligence" } },
        mode: "replay",
        fixture,
    });
    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    assertEquals(result.output, fixture.calls[0].res.body);
    const output = result.output as Record<string, unknown>;
    assertEquals(output.id, "artificial-intelligence");
    assert((output.stories as unknown[]).length > 0, "stories present");
});

Deno.test({
    name: "hangingcontext#topic live (keyless; needs --allow-net)",
    ignore: noNet,
    fn: async () => {
        const unit = await testSealedUnit("hangingcontext#topic");
        const result = await runEndpoint({
            unit,
            input: { pathParams: { topic: "finance-investing" } },
            mode: "live",
        });
        assertEquals(
            result.isProviderError,
            false,
            JSON.stringify(result.output),
        );
        assert(
            Array.isArray((result.output as Record<string, unknown>).stories),
            "stories array present",
        );
    },
});
