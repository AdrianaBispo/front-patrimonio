import { chromium } from "playwright";
import fs from "node:fs/promises";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5173";
const ARTIFACTS = "qa-artifacts";
const agora = Date.now().toString().slice(-8);
const dados = {
  nome: `QA Equip Sem Img ${agora}`,
  serie: agora,
};

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
  if (Object.keys(detalhes).length) console.log(JSON.stringify(detalhes, null, 2));
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
  };
  try {
    entry.postData = request.postDataJSON?.() ?? request.postData();
  } catch {
    entry.postData = request.postData();
  }
  if (response.status() >= 400) {
    try {
      entry.body = (await response.text()).slice(0, 400);
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
await page.locator("#nome").fill(dados.nome);
await page.locator("#serie").fill(dados.serie);

const statusOptions = await page.locator("#status_id option").all();
for (const opt of statusOptions) {
  const value = await opt.getAttribute("value");
  if (value) {
    await page.locator("#status_id").selectOption(value);
    break;
  }
}
const userOptions = await page.locator("#usuario_id option").all();
for (const opt of userOptions) {
  const value = await opt.getAttribute("value");
  if (value) {
    await page.locator("#usuario_id").selectOption(value);
    break;
  }
}
await page.locator("#descricao").fill("Cadastro sem imagem");
// propositalmente sem imagem_url e sem arquivo

const before = mutacoes.length;
await page.getByRole("button", { name: /criar equipamento/i }).click();
await page.waitForTimeout(2500);

const createReq = mutacoes
  .slice(before)
  .find((m) => m.method === "POST" && m.url.includes("/equipaments/create"));
const uploadReq = mutacoes
  .slice(before)
  .find((m) => m.url.includes("/image-upload"));

await page.screenshot({
  path: `${ARTIFACTS}/qa-equipamento-sem-imagem.png`,
  fullPage: true,
});

registrar(
  "Cadastro sem imagem (sem chamar upload)",
  Boolean(createReq) && createReq.status < 400 && !uploadReq,
  {
    status: createReq?.status ?? null,
    payload: createReq?.postData ?? null,
    uploadChamado: Boolean(uploadReq),
    urlPage: page.url(),
    body: createReq?.body ?? uploadReq?.body ?? null,
  },
);

await fs.writeFile(
  `${ARTIFACTS}/resultados-equipamento-sem-imagem.json`,
  JSON.stringify({ dados, testes, mutacoes }, null, 2),
  "utf8",
);

console.log("\n=== RESUMO ===");
console.log(
  JSON.stringify(
    {
      total: testes.length,
      passou: testes.filter((t) => t.ok).length,
      falhou: testes.filter((t) => !t.ok).length,
    },
    null,
    2,
  ),
);

await browser.close();
