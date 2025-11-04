import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function uploadVendoredFilesAndCreateVS(): Promise<string> {
  const dir = path.join(process.cwd(), "assistants", "files");
  let entries: string[] = [];
  try { entries = await fs.readdir(dir); } catch { return ""; }
  if (!entries.length) return "";

  const vs = await openai.beta.vectorStores.create({ name: "marel-kb" });
  for (const filename of entries) {
    const fp = path.join(dir, filename);
    const file = await openai.files.create({ file: fs.createReadStream(fp) as any, purpose: "assistants" });
    await openai.beta.vectorStores.files.create(vs.id, { file_id: file.id });
  }
  return vs.id;
}

async function main() {
  const specPath = path.join(process.cwd(), "assistants", "marel-fish-sales.json");
  const spec = JSON.parse(await fs.readFile(specPath, "utf8"));

  let vector_store_ids = spec?.tool_resources?.file_search?.vector_store_ids ?? [];
  if (!vector_store_ids.length) {
    const vsId = await uploadVendoredFilesAndCreateVS();
    if (vsId) vector_store_ids = [vsId];
  }

  const body: any = {
    name: spec.name,
    model: spec.model,
    instructions: spec.instructions,
    tools: spec.tools,
    metadata: spec.metadata,
    response_format: spec.response_format,
    temperature: spec.temperature,
    top_p: spec.top_p,
    tool_resources: vector_store_ids.length ? { file_search: { vector_store_ids } } : undefined
  };

  // find existing by name
  let existing: any = null;
  for await (const a of openai.beta.assistants.list({ limit: 100 })) if (a.name === spec.name) { existing = a; break; }

  const res = existing
    ? await openai.beta.assistants.update(existing.id, body)
    : await openai.beta.assistants.create(body);

  console.log("Assistant ready:", res.id);
}

main().catch(e => { console.error(e); process.exit(1); });

