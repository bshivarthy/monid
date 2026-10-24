import { assert, assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const fixturesDir = fromFileUrl(new URL("./fixtures/", import.meta.url));

Deno.test("hangingcontext#story happy (recorded 2026-10-24): full story with cited Manifests, FREE settle", async () => {
    const unit = await testSealedUnit("hangingcontext#story");
    const fixture = await loadFixture(`${fixturesDir}happy.json`);
    const result = await runEndpoint({
        unit,
        input: {
            pathParams: {
                date: "2026-10-24",
                slug: "world-series-game1-anatomy",
            },
        },
        mode: "replay",
        fixture,
    });
    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    assertEquals(result.output, fixture.calls[0].res.body);
    const output = result.output as Record<string, unknown>;
    assert(
        (output.cited_manifest_ids as unknown[]).length > 0,
        "cited Manifests present",
    );
});

Deno.test("hangingcontext#story not found (recorded 2026-10-24): 404 is data, zero usage", async () => {
    const unit = await testSealedUnit("hangingcontext#story");
    const fixture = await loadFixture(`${fixturesDir}not-found.json`);
    const result = await runEndpoint({
        unit,
        input: { pathParams: { date: "2026-01-01", slug: "no-such-story" } },
        mode: "replay",
        fixture,
    });
    assertEquals(result.isProviderError, true);
    assertEquals(result.usage, { credits: {}, evidence: {} });
});
