import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5173";
const ARTIFACTS = "qa-artifacts";
const IMAGE = path.resolve("qa-artifacts/upload-test.png");
const agora = Date.now().toString().slice(-8);

const browser = await chromium.launch({
  executablePath: EDGE,
  headless: false,
  slowMo: 150,
});
const page = await (
  await browser.newContext({ viewport: { width: 1440, height: 1000 } })
).newPage();

const testes = [];
const mutacoes = [];

function registrar(nome, ok, detalhes = {}) {
  testes.push({ nome, ok, ...detalhes });
  console.log(`${ok ? "PASS" : "FAIL"} - ${nome}`);
  if (Object.keys(detalhes).length) {
    console.log(JSON.stringify(detalhes, null, 2));
  }
}

page.on("response", async (response) => {
  const request = response.request();
  const url = response.url();
  if (!url.includes("/api/")) return;
  if (!["POST", "PUT"].includes(request.method())) return;

  const entry = {
    status: response.status(),
    method: request.method(),
    url,
    contentType: request.headers()["content-type"] ?? null,
  };

  try {
    entry.postData = request.postDataJSON?.() ?? request.postData();
  } catch {
    entry.postData = request.postData();
  }

  if (response.status() >= 400 || url.includes("image-upload")) {
    try {
      entry.body = (await response.text()).slice(0, 600);
    } catch {
      entry.body = null;
    }
  }

  mutacoes.push(entry);
});

await fs.mkdir(ARTIFACTS, { recursive: true });

await page.goto(`${BASE}/auth/login`, { waitUntil: "networkidle" });
await page.locator("#user").fill("admin@example.com");
await page.locator("#password").fill("senha1234");
await page.getByRole("button", { name: /entrar|login/i }).click();
await page.waitForTimeout(1500);
registrar("Login", page.url().includes("/users"), { url: page.url() });

await page.goto(`${BASE}/equipamentos/cadastrar`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const semCampoUrl =
  (await page.locator("#imagem_url, label:has-text('URL da imagem')").count()) === 0;
registrar("Campo URL ausente", semCampoUrl);

await page.locator("#nome").fill(`QA Upload ${agora}`);
await page.locator("#serie").fill(agora);

for (const selector of [
  "#categoria_id",
  "#tipo_equipamento_id",
  "#status_id",
  "#usuario_id",
]) {
  const options = await page.locator(`${selector} option`).all();
  for (const opt of options) {
    const value = await opt.getAttribute("value");
    if (value) {
      await page.locator(selector).selectOption(value);
      break;
    }
  }
}

await page.locator("#descricao").fill("Teste upload multipart image");
await page.locator("#image-input").setInputFiles(IMAGE);

const before = mutacoes.length;
await page.getByRole("button", { name: /criar equipamento/i }).click();
await page.waitForTimeout(3000);

const uploadReq = mutacoes
  .slice(before)
  .find((m) => m.url.includes("/equipaments/image-upload"));
const createReq = mutacoes
  .slice(before)
  .find((m) => m.url.includes("/equipaments/create"));

const contentTypeOk =
  typeof uploadReq?.contentType === "string" &&
  uploadReq.contentType.includes("multipart/form-data");

await page.screenshot({
  path: `${ARTIFACTS}/qa-upload-image.png`,
  fullPage: true,
});

registrar("Upload image multipart", Boolean(uploadReq) && uploadReq.status < 400, {
  status: uploadReq?.status ?? null,
  contentType: uploadReq?.contentType ?? null,
  contentTypeOk,
  body: uploadReq?.body ?? null,
});

registrar(
  "Cadastro após upload",
  Boolean(createReq) && createReq.status < 400,
  {
    status: createReq?.status ?? null,
    payload: createReq?.postData ?? null,
    body: createReq?.body ?? null,
    urlPage: page.url(),
  },
);

const resultado = {
  testes,
  mutacoes: mutacoes.filter(
    (m) =>
      m.url.includes("image-upload") ||
      m.url.includes("/equipaments/create") ||
      m.url.includes("/auth/login"),
  ),
  resumo: {
    total: testes.length,
    passou: testes.filter((t) => t.ok).length,
    falhou: testes.filter((t) => !t.ok).length,
  },
};

await fs.writeFile(
  `${ARTIFACTS}/resultados-upload-image.json`,
  JSON.stringify(resultado, null, 2),
  "utf8",
);

console.log("\n=== RESUMO ===");
console.log(JSON.stringify(resultado.resumo, null, 2));

await browser.close();
