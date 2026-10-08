/* Offline route checks: isolated environment, mocked fetch, no API credentials. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const context = { signal: "discovery", section: "playground", appearance: "light", theme: "blueprint" };
const success = text => new Response(JSON.stringify({
  status: "completed",
  output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ text }) }] }],
}), { headers: { "Content-Type": "application/json" } });

function loadRoute({ enabled = true, fetch = async () => success("Small discovery. Excellent human."), now = () => Date.now() } = {}) {
  const globals = {
    Buffer, TextDecoder, URL, Request, Response, Headers, AbortController, setTimeout, clearTimeout,
    Date: class extends Date { static now() { return now(); } },
    process: { env: enabled ? { CAT_AI_ENABLED: "true", OPENAI_API_KEY: "offline-test-placeholder" } : {} },
    fetch,
  };
  function load(relative) {
    const source = fs.readFileSync(path.join(__dirname, "..", relative), "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    vm.runInNewContext(output, {
      ...globals, exports,
      require: name => name === "@/lib/cat-ai" ? load("lib/cat-ai.ts") : require(name),
    }, { filename: relative });
    return exports;
  }
  return load("app/api/cat-comment/route.ts");
}

function request(value = context, headers = {}, body) {
  return new Request("http://localhost:5260/api/cat-comment", {
    method: "POST",
    headers: { origin: "http://localhost:5260", "content-type": "application/json", ...headers },
    body: body === undefined ? JSON.stringify(value) : body,
  });
}

async function main() {
  let calls = 0;
  const disabled = loadRoute({ enabled: false, fetch: async () => { calls += 1; throw new Error("Unexpected request"); } });
  assert.deepEqual(await (await disabled.GET()).json(), { enabled: false });
  assert.equal((await disabled.POST(request())).status, 503);
  assert.equal(calls, 0);

  const route = loadRoute({ fetch: async (url, options) => {
    calls += 1;
    assert.equal(url, "https://api.openai.com/v1/responses");
    const payload = JSON.parse(options.body);
    assert.equal(payload.store, false);
    assert.equal(payload.max_output_tokens, 128);
    assert.equal(payload.reasoning.effort, "none");
    assert.equal(payload.text.format.strict, true);
    assert.deepEqual(JSON.parse(payload.input[0].content), context);
    assert.equal(options.headers.Authorization, "Bearer offline-test-placeholder");
    return success("Small discovery. Excellent human.");
  } });
  assert.deepEqual(await (await route.GET()).json(), { enabled: true });
  assert.equal((await route.POST(request(context, { origin: "https://unrelated.example" }))).status, 403);
  assert.equal((await route.POST(request(context, { "sec-fetch-site": "cross-site" }))).status, 403);
  assert.equal((await route.POST(request(context, { "content-type": "text/plain" }))).status, 415);
  assert.equal((await route.POST(request(context, { "x-forwarded-for": "invalid-body" }, "x".repeat(1_025)))).status, 413);
  assert.equal((await route.POST(request({ ...context, formText: "Never sent" }, { "x-forwarded-for": "extra-key" }))).status, 400);
  assert.equal((await route.POST(request({ ...context, signal: "arbitrary prompt" }, { "x-forwarded-for": "invalid-enum" }))).status, 400);
  const first = await route.POST(request());
  assert.equal(first.status, 200);
  assert.equal(first.headers.get("cache-control"), "no-store");
  assert.deepEqual(await first.json(), { text: "Small discovery. Excellent human." });
  assert.equal((await route.POST(request())).status, 200);
  assert.equal(calls, 1, "Identical context should use the cache");
  for (let index = 0; index < 4; index += 1) assert.equal((await route.POST(request())).status, 200);
  assert.equal((await route.POST(request())).status, 429);
  assert.equal(calls, 1);

  let simultaneousCalls = 0;
  let release;
  const simultaneous = loadRoute({ fetch: () => {
    simultaneousCalls += 1;
    return new Promise(resolve => { release = () => resolve(success("A shared tiny celebration.")); });
  } });
  const a = simultaneous.POST(request(context, { "x-forwarded-for": "a" }));
  const b = simultaneous.POST(request(context, { "x-forwarded-for": "b" }));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(simultaneousCalls, 1, "Identical pending requests should share one generation");
  release();
  assert.equal((await a).status, 200);
  assert.equal((await b).status, 200);

  let clock = Date.UTC(2026, 9, 8);
  let budgetCalls = 0;
  const budget = loadRoute({ now: () => clock, fetch: async () => { budgetCalls += 1; return success("A tiny celebration."); } });
  const sections = ["intro", "playground", "work", "about", "contact"];
  const themes = ["editorial", "swiss", "blueprint", "play", "botanical"];
  for (const [hour, allowed] of [[0, 40], [1, 40], [2, 20]]) {
    clock = Date.UTC(2026, 9, 8, hour);
    for (let index = 0; index <= allowed; index += 1) {
      const varied = { ...context, signal: index < 25 ? "section" : "project", section: sections[Math.floor((index % 25) / 5)], theme: themes[index % 5] };
      const response = await budget.POST(request(varied, { "x-forwarded-for": `budget-${hour}-${index}` }));
      assert.equal(response.status, index < allowed ? 200 : 429);
    }
  }
  assert.equal(budgetCalls, 100, "Generation attempts must respect process-wide hourly and daily caps");

  for (const text of ["<script>bad</script>", "x".repeat(141), "Visit https://unrelated.example", ""]) {
    const invalidOutput = loadRoute({ fetch: async () => success(text) });
    assert.equal((await invalidOutput.POST(request())).status, 502);
  }
  const refused = loadRoute({ fetch: async () => new Response(JSON.stringify({ status: "completed", output: [{ type: "message", content: [{ type: "refusal", refusal: "No" }] }] })) });
  assert.equal((await refused.POST(request())).status, 502);
  const failed = loadRoute({ fetch: async () => { throw new Error("Private upstream error"); } });
  const failedResponse = await failed.POST(request());
  assert.equal(failedResponse.status, 502);
  assert.deepEqual(await failedResponse.json(), { text: "" });
  console.log("Cat AI offline checks passed: disabled gate, request boundaries, cache, throttling, global budgets, deduplication, invalid output, and fallback.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
