import { chromium } from "playwright";
import fs from "node:fs/promises";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5173";
const ARTIFACTS = "qa-artifacts";
const agora = Date.now().toString().slice(-8);
const dados = {
  categoria: `QA Cat Fix ${agora}`,
  categoriaEdit: `QA Cat Fix Edit ${agora}`,
  tipo: `QA Tipo Fix ${agora}`,
};

const browser = await chromium.launch({
  executablePath: EDGE,
  headless: false,
  slowMo: 180,
});
const page = await (await browser.newContext({
  viewport: { width: 1440, height: 1000 },
})).newPage();

const testes = [];
const mutacoes = [];
const http = [];

function registrar(nome, ok, detalhes = {}) {
  testes.push({ nome, ok, ...detalhes });
  console.log(`${ok ? "PASS" : "FAIL"} - ${nome}`);
  if (Object.keys(detalhes).length) console.log(JSON.stringify(detalhes, null, 2));
}

page.on("response", async (response) => {
  const request = response.request();
  const url = response.url();
  if (!url.includes("/api/")) return;
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
  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) {
    mutacoes.push(entry);
  }
  if (response.status() >= 400) {
    try {
      entry.body = (await response.text()).slice(0, 400);
    } catch {
      entry.body = null;
    }
    http.push(entry);
  }
});

await fs.mkdir(ARTIFACTS, { recursive: true });

async function shot(nome) {
  await page.screenshot({ path: `${ARTIFACTS}/${nome}.png`, fullPage: true });
}

await page.goto(`${BASE}/auth/login`, { waitUntil: "networkidle" });
await page.locator("#user").fill("admin@example.com");
await page.locator("#password").fill("senha1234");
await page.getByRole("button", { name: /entrar|login/i }).click();
await page.waitForTimeout(1200);
registrar("Login", page.url().includes("/users"), { url: page.url() });

// Categoria cadastro + edição
await page.goto(`${BASE}/categorias/cadastrar`, { waitUntil: "networkidle" });
await page.locator("#nome").fill(dados.categoria);
await page.locator("#tipo").selectOption("AT");
await page.locator("#nota").fill("Nota fix");
let before = mutacoes.length;
await page.getByRole("button", { name: /salvar/i }).click();
await page.waitForTimeout(1800);
const catCreate = mutacoes
  .slice(before)
  .find((m) => m.method === "POST" && m.url.includes("/categoria/create"));
await shot("fix-categoria-cadastro");
registrar("Categoria cadastro", Boolean(catCreate) && catCreate.status < 400, {
  status: catCreate?.status ?? null,
  url: page.url(),
});

await page.goto(`${BASE}/categorias`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const linhaCat = page.locator("tr", { hasText: dados.categoria }).first();
if ((await linhaCat.count()) === 0) {
  registrar("Categoria edição", false, { motivo: "não encontrada" });
} else {
  await linhaCat.locator("button").first().click();
  await page.waitForTimeout(1200);
  await page.locator("#nome").fill(dados.categoriaEdit);
  before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(1800);
  const catPut = mutacoes
    .slice(before)
    .find((m) => m.method === "PUT" && m.url.includes("/categoria/update/"));
  await shot("fix-categoria-edicao");
  registrar(
    "Categoria edição",
    Boolean(catPut) &&
      catPut.status < 400 &&
      !catPut.url.includes("[object"),
    {
      status: catPut?.status ?? null,
      urlReq: catPut?.url ?? null,
      payload: catPut?.postData ?? null,
      urlPage: page.url(),
      body: catPut?.body ?? null,
    },
  );
}

// Tipo cadastro
await page.goto(`${BASE}/tipo-equipamento/cadastrar`, {
  waitUntil: "networkidle",
});
await page.locator("#nome").fill(dados.tipo);
await page.locator("#nota").fill("Nota tipo fix");
before = mutacoes.length;
await page.getByRole("button", { name: /salvar/i }).click();
await page.waitForTimeout(2000);
const tipoCreate = mutacoes
  .slice(before)
  .find((m) => m.method === "POST" && m.url.includes("/tipo_equipamento/create"));
await shot("fix-tipo-cadastro");
registrar(
  "Tipo cadastro",
  Boolean(tipoCreate) && tipoCreate.status < 400,
  {
    status: tipoCreate?.status ?? null,
    urlReq: tipoCreate?.url ?? null,
    urlPage: page.url(),
    body: tipoCreate?.body ?? null,
  },
);

const resultado = {
  dados,
  testes,
  mutacoes,
  http,
  resumo: {
    total: testes.length,
    passou: testes.filter((t) => t.ok).length,
    falhou: testes.filter((t) => !t.ok).length,
  },
};

await fs.writeFile(
  `${ARTIFACTS}/resultados-categoria-tipo.json`,
  JSON.stringify(resultado, null, 2),
  "utf8",
);
console.log("\n=== RESUMO ===");
console.log(JSON.stringify(resultado.resumo, null, 2));
await page.waitForTimeout(800);
await browser.close();
