import { chromium } from "playwright";
import fs from "node:fs/promises";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5173";
const ARTIFACTS = "qa-artifacts";

const agora = Date.now().toString().slice(-8);
const usuario = {
  nome: `QA Usuario ${agora}`,
  celular: `1199${agora}`,
  email: `qa.usuario.${agora}@example.com`,
  password: "senha1234",
  nomeEditado: `QA Usuario Edit ${agora}`,
};

const browser = await chromium.launch({
  executablePath: EDGE,
  headless: false,
  slowMo: 250,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();

const eventos = [];
const http = [];
const mutacoes = [];
const testes = [];

function registrar(nome, ok, detalhes = {}) {
  testes.push({ nome, ok, ...detalhes });
  console.log(`${ok ? "PASS" : "FAIL"} - ${nome}`);
  if (Object.keys(detalhes).length) {
    console.log(JSON.stringify(detalhes, null, 2));
  }
}

page.on("pageerror", (error) => {
  eventos.push({ tipo: "pageerror", mensagem: error.message, url: page.url() });
});

page.on("console", (message) => {
  if (message.type() === "error") {
    eventos.push({
      tipo: "console",
      mensagem: message.text(),
      url: page.url(),
    });
  }
});

page.on("response", async (response) => {
  const request = response.request();
  const url = response.url();
  if (!url.includes("/api/")) return;

  const entry = {
    status: response.status(),
    method: request.method(),
    url,
  };

  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method())) {
    try {
      entry.postData = request.postDataJSON?.() ?? request.postData();
    } catch {
      entry.postData = request.postData();
    }
    mutacoes.push(entry);
  }

  if (response.status() >= 400) {
    try {
      entry.body = await response.text();
    } catch {
      entry.body = null;
    }
    http.push(entry);
  }
});

await fs.mkdir(ARTIFACTS, { recursive: true });

async function shot(nome) {
  await page.screenshot({
    path: `${ARTIFACTS}/${nome}.png`,
    fullPage: true,
  });
}

async function login() {
  await page.goto(`${BASE}/auth/login`, { waitUntil: "networkidle" });
  await page.locator("#user").fill("admin@example.com");
  await page.locator("#password").fill("senha1234");
  await page.getByRole("button", { name: /entrar|login/i }).click();
  await page.waitForTimeout(1500);
  await shot("qa-usuario-01-login");
  registrar("Login admin", page.url().includes("/users"), { url: page.url() });
}

async function listagem() {
  await page.goto(`${BASE}/users`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const texto = await page.locator("body").innerText();
  const temTabela = await page.locator("table").count();
  const temAdicionar = await page.getByRole("button", { name: /adicionar/i }).count();
  await shot("qa-usuario-02-listagem");
  registrar("Listagem de usuários", temTabela > 0 && temAdicionar > 0, {
    url: page.url(),
    temTabela,
    temAdicionar,
    trecho: texto.slice(0, 400),
  });
}

async function validacaoCadastro() {
  await page.getByRole("button", { name: /adicionar/i }).click();
  await page.waitForURL("**/users/cadastrar");
  await page.waitForTimeout(800);

  const semDepartamento =
    (await page.locator("#departamento_id, [name='departamento_id'], label:has-text('Departamento')").count()) === 0;

  await page.getByRole("button", { name: /criar usuário/i }).click();
  await page.waitForTimeout(600);

  const erros = await page.locator("body").innerText();
  const validou =
    /obrigat|informe|válido|mínimo|selecione/i.test(erros) ||
    (await page.locator("text=/obrigat|informe|válido|mínimo/i").count()) > 0;

  await shot("qa-usuario-03-validacao");
  registrar("Campo departamento ausente", semDepartamento);
  registrar("Validação do formulário de cadastro", validou, {
    url: page.url(),
  });
}

async function cadastro() {
  await page.locator("#nome").fill(usuario.nome);
  await page.locator("#celular").fill(usuario.celular);
  await page.locator("#email").fill(usuario.email);
  await page.locator("#password").fill(usuario.password);

  const roleSelect = page.locator("#role_id");
  const options = await roleSelect.locator("option").allTextContents();
  if (options.length > 1) {
    await roleSelect.selectOption({ index: 1 });
  }

  const before = mutacoes.length;
  await page.getByRole("button", { name: /criar usuário/i }).click();
  await page.waitForTimeout(2000);

  const registerReq = mutacoes
    .slice(before)
    .find((m) => m.method === "POST" && m.url.includes("/auth/register"));

  const voltouLista = page.url().endsWith("/users");
  const listaTexto = await page.locator("body").innerText();
  const apareceNaLista = listaTexto.includes(usuario.nome);

  await shot("qa-usuario-04-cadastro");
  registrar("Cadastro de usuário", Boolean(registerReq) && (registerReq.status < 400) && voltouLista, {
    url: page.url(),
    status: registerReq?.status ?? null,
    payload: registerReq?.postData ?? null,
    departamentoNull:
      registerReq?.postData?.departamento_id === null ||
      registerReq?.postData === null
        ? registerReq?.postData?.departamento_id ?? "sem-payload"
        : registerReq?.postData?.departamento_id,
    apareceNaLista,
  });

  return registerReq;
}

async function pesquisa() {
  await page.goto(`${BASE}/users`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const input = page.getByPlaceholder(/pesquisar usuário/i);
  await input.fill(usuario.nome);
  await input.press("Enter");
  await page.waitForTimeout(1200);
  const texto = await page.locator("body").innerText();
  await shot("qa-usuario-05-pesquisa");
  registrar("Pesquisa de usuário", texto.includes(usuario.nome), {
    url: page.url(),
    trecho: texto.slice(0, 500),
  });
}

async function edicao() {
  await page.goto(`${BASE}/users`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const linha = page.locator("tr", { hasText: usuario.nome }).first();
  const existe = (await linha.count()) > 0;

  if (!existe) {
    registrar("Edição de usuário", false, {
      motivo: "Usuário cadastrado não encontrado na lista",
    });
    await shot("qa-usuario-06-edicao-bloqueada");
    return;
  }

  await linha.locator("button").first().click();
  await page.waitForTimeout(1200);

  const urlEdicao = page.url();
  const carregouForm =
    urlEdicao.includes("/users/editar/") &&
    (await page.locator("#nome").inputValue()) !== "";

  const semDepartamento =
    (await page.locator("#departamento_id, [name='departamento_id'], label:has-text('Departamento')").count()) === 0;

  await page.locator("#nome").fill(usuario.nomeEditado);

  const before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(2000);

  const putReq = mutacoes
    .slice(before)
    .find((m) => m.method === "PUT" && m.url.includes("/auth/users/"));

  const voltouLista = page.url().endsWith("/users");
  const listaTexto = await page.locator("body").innerText();

  await shot("qa-usuario-06-edicao");
  registrar("Campo departamento ausente na edição", semDepartamento);
  registrar("Edição de usuário", Boolean(putReq) && (putReq.status < 400) && voltouLista && carregouForm, {
    urlEdicao,
    urlFinal: page.url(),
    status: putReq?.status ?? null,
    payload: putReq?.postData ?? null,
    departamentoNull: putReq?.postData?.departamento_id ?? "sem-payload",
    apareceNomeEditado: listaTexto.includes(usuario.nomeEditado),
  });
}

try {
  await login();
  await listagem();
  await validacaoCadastro();
  await cadastro();
  await pesquisa();
  await edicao();
} catch (error) {
  eventos.push({ tipo: "script", mensagem: error.message });
  await shot("qa-usuario-erro");
  registrar("Execução do script", false, { erro: error.message });
}

const resultado = {
  usuario,
  testes,
  mutacoes,
  http,
  eventos,
  resumo: {
    total: testes.length,
    passou: testes.filter((t) => t.ok).length,
    falhou: testes.filter((t) => !t.ok).length,
  },
};

await fs.writeFile(
  `${ARTIFACTS}/resultados-usuario.json`,
  JSON.stringify(resultado, null, 2),
  "utf8",
);

console.log("\n=== RESUMO ===");
console.log(JSON.stringify(resultado.resumo, null, 2));

await page.waitForTimeout(1500);
await browser.close();
