import { chromium } from "playwright";
import fs from "node:fs/promises";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5173";
const ARTIFACTS = "qa-artifacts";
const agora = Date.now().toString().slice(-8);

const dados = {
  usuario: {
    nome: `QA Usuario ${agora}`,
    celular: `1199${agora}`,
    email: `qa.usuario.${agora}@example.com`,
    password: "senha1234",
    nomeEditado: `QA Usuario Edit ${agora}`,
  },
  categoria: `QA Cat ${agora}`,
  categoriaEdit: `QA Cat Edit ${agora}`,
  tipo: `QA Tipo ${agora}`,
  tipoEdit: `QA Tipo Edit ${agora}`,
  equipamento: `QA Equip ${agora}`,
  serie: agora,
  imagem: `https://picsum.photos/seed/${agora}/400/300`,
};

const browser = await chromium.launch({
  executablePath: EDGE,
  headless: false,
  slowMo: 150,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();

const testes = [];
const mutacoes = [];
const http = [];
const eventos = [];

function registrar(modulo, nome, ok, detalhes = {}) {
  testes.push({ modulo, nome, ok, ...detalhes });
  console.log(`${ok ? "PASS" : "FAIL"} [${modulo}] ${nome}`);
  if (Object.keys(detalhes).length) {
    console.log(JSON.stringify(detalhes, null, 2));
  }
}

page.on("pageerror", (error) => {
  eventos.push({ tipo: "pageerror", mensagem: error.message, url: page.url() });
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
      entry.body = (await response.text()).slice(0, 500);
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

async function textoBody() {
  return page.locator("body").innerText();
}

async function selectPrimeiraOpcao(selector) {
  const select = page.locator(selector);
  const options = await select.locator("option").all();
  for (const option of options) {
    const value = await option.getAttribute("value");
    if (value) {
      await select.selectOption(value);
      return value;
    }
  }
  return null;
}

async function login() {
  await page.goto(`${BASE}/auth/login`, { waitUntil: "networkidle" });
  await page.locator("#user").fill("admin@example.com");
  await page.locator("#password").fill("senha1234");
  await page.getByRole("button", { name: /entrar|login/i }).click();
  await page.waitForTimeout(1500);
  await shot("sistema-01-login");
  registrar("Auth", "Login", page.url().includes("/users"), { url: page.url() });
}

async function testarUsuarios() {
  await page.goto(`${BASE}/users`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  registrar(
    "Usuários",
    "Listagem",
    (await page.locator("table").count()) > 0,
    { url: page.url() },
  );

  await page.getByRole("button", { name: /adicionar/i }).click();
  await page.waitForTimeout(800);
  const semDepartamento =
    (await page
      .locator(
        "#departamento_id, [name='departamento_id'], label:has-text('Departamento')",
      )
      .count()) === 0;
  registrar("Usuários", "Campo departamento ausente", semDepartamento);

  await page.getByRole("button", { name: /criar usuário/i }).click();
  await page.waitForTimeout(500);
  registrar(
    "Usuários",
    "Validação cadastro",
    /obrigat|mínimo|selecione|informe/i.test(await textoBody()),
  );

  await page.locator("#nome").fill(dados.usuario.nome);
  await page.locator("#celular").fill(dados.usuario.celular);
  await page.locator("#email").fill(dados.usuario.email);
  await page.locator("#password").fill(dados.usuario.password);
  await selectPrimeiraOpcao("#role_id");

  let before = mutacoes.length;
  await page.getByRole("button", { name: /criar usuário/i }).click();
  await page.waitForTimeout(2000);
  const createReq = mutacoes
    .slice(before)
    .find((m) => m.method === "POST" && m.url.includes("/auth/register"));
  await shot("sistema-02-usuario-cadastro");
  registrar(
    "Usuários",
    "Cadastro",
    Boolean(createReq) && createReq.status < 400 && page.url().endsWith("/users"),
    {
      status: createReq?.status ?? null,
      departamento_id: createReq?.postData?.departamento_id ?? null,
      body: createReq?.body ?? null,
    },
  );

  await page.goto(`${BASE}/users`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const input = page.getByPlaceholder(/pesquisar usuário/i);
  await input.fill(dados.usuario.nome);
  await input.press("Enter");
  await page.waitForTimeout(1200);
  registrar(
    "Usuários",
    "Pesquisa",
    (await textoBody()).includes(dados.usuario.nome),
  );

  const linha = page.locator("tr", { hasText: dados.usuario.nome }).first();
  if ((await linha.count()) === 0) {
    registrar("Usuários", "Edição", false, { motivo: "usuário não encontrado" });
    return;
  }

  await linha.locator("button").first().click();
  await page.waitForTimeout(1200);
  await page.locator("#nome").fill(dados.usuario.nomeEditado);
  before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(2000);
  const putReq = mutacoes
    .slice(before)
    .find((m) => m.method === "PUT" && m.url.includes("/auth/users/"));
  await shot("sistema-03-usuario-edicao");
  registrar(
    "Usuários",
    "Edição",
    Boolean(putReq) && putReq.status < 400 && page.url().endsWith("/users"),
    {
      status: putReq?.status ?? null,
      body: putReq?.body ?? null,
    },
  );
}

async function testarCategorias() {
  await page.goto(`${BASE}/categorias`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  registrar("Categorias", "Listagem", (await page.locator("table").count()) > 0);

  await page.getByRole("button", { name: /adicionar/i }).click();
  await page.waitForTimeout(800);
  await page.locator("#nome").fill(dados.categoria);
  await page.locator("#tipo").selectOption("AT");
  await page.locator("#nota").fill("Nota QA");
  let before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(1800);
  const createReq = mutacoes
    .slice(before)
    .find((m) => m.method === "POST" && m.url.includes("/categoria/create"));
  await shot("sistema-04-categoria-cadastro");
  registrar(
    "Categorias",
    "Cadastro",
    Boolean(createReq) && createReq.status < 400,
    { status: createReq?.status ?? null, body: createReq?.body ?? null },
  );

  await page.goto(`${BASE}/categorias`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const linha = page.locator("tr", { hasText: dados.categoria }).first();
  if ((await linha.count()) === 0) {
    registrar("Categorias", "Edição", false, { motivo: "não encontrada" });
    return;
  }
  await linha.locator("button").first().click();
  await page.waitForTimeout(1200);
  await page.locator("#nome").fill(dados.categoriaEdit);
  before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(1800);
  const putReq = mutacoes
    .slice(before)
    .find((m) => m.method === "PUT" && m.url.includes("/categoria/update/"));
  await shot("sistema-05-categoria-edicao");
  registrar(
    "Categorias",
    "Edição",
    Boolean(putReq) &&
      putReq.status < 400 &&
      !String(putReq.url).includes("[object"),
    {
      status: putReq?.status ?? null,
      urlReq: putReq?.url ?? null,
      body: putReq?.body ?? null,
    },
  );
}

async function testarTipos() {
  await page.goto(`${BASE}/tipo-equipamento`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  registrar(
    "Tipo Equipamento",
    "Listagem",
    (await page.locator("table").count()) > 0,
  );

  await page.getByRole("button", { name: /adicionar/i }).click();
  await page.waitForTimeout(800);
  await page.locator("#nome").fill(dados.tipo);
  await page.locator("#nota").fill("Nota tipo QA");
  let before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(2000);
  const createReq = mutacoes
    .slice(before)
    .find(
      (m) => m.method === "POST" && m.url.includes("/tipo_equipamento/create"),
    );
  await shot("sistema-06-tipo-cadastro");
  registrar(
    "Tipo Equipamento",
    "Cadastro",
    Boolean(createReq) && createReq.status < 400,
    {
      status: createReq?.status ?? null,
      urlReq: createReq?.url ?? null,
      body: createReq?.body ?? null,
    },
  );

  await page.goto(`${BASE}/tipo-equipamento`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const linha = page.locator("tr", { hasText: dados.tipo }).first();
  if ((await linha.count()) === 0) {
    registrar("Tipo Equipamento", "Edição", false, {
      motivo: "não encontrado",
    });
    return;
  }
  await linha.locator("button").first().click();
  await page.waitForTimeout(1200);
  await page.locator("#nome").fill(dados.tipoEdit);
  before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(2000);
  const putReq = mutacoes
    .slice(before)
    .find(
      (m) => m.method === "PUT" && m.url.includes("/tipo_equipamento/update/"),
    );
  await shot("sistema-07-tipo-edicao");
  registrar(
    "Tipo Equipamento",
    "Edição",
    Boolean(putReq) && putReq.status < 400,
    { status: putReq?.status ?? null, body: putReq?.body ?? null },
  );
}

async function testarEquipamentos() {
  await page.goto(`${BASE}/equipamentos`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  registrar(
    "Equipamentos",
    "Listagem",
    (await page.locator("table").count()) > 0 ||
      /equipamento|adicionar/i.test(await textoBody()),
  );

  await page.getByRole("button", { name: /adicionar/i }).click();
  await page.waitForTimeout(1500);
  await page.locator("#nome").fill(dados.equipamento);
  await page.locator("#serie").fill(dados.serie);
  await selectPrimeiraOpcao("#status_id");
  await selectPrimeiraOpcao("#usuario_id");
  await page.locator("#descricao").fill("Descrição QA");
  await page.locator("#imagem_url").fill(dados.imagem);

  const before = mutacoes.length;
  await page.getByRole("button", { name: /criar equipamento/i }).click();
  await page.waitForTimeout(2500);
  const createReq = mutacoes
    .slice(before)
    .find(
      (m) =>
        m.method === "POST" &&
        (m.url.includes("/equipaments/create") ||
          m.url.includes("/image-upload")),
    );
  await shot("sistema-08-equipamento-cadastro");
  registrar(
    "Equipamentos",
    "Cadastro",
    Boolean(createReq) &&
      createReq.status < 400 &&
      page.url().includes("/equipamentos") &&
      !page.url().includes("/cadastrar"),
    {
      status: createReq?.status ?? null,
      urlReq: createReq?.url ?? null,
      body: createReq?.body ?? null,
    },
  );

  await page.goto(`${BASE}/equipamentos`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const input = page.getByPlaceholder(/pesquisar/i).first();
  if ((await input.count()) > 0) {
    await input.fill(dados.equipamento);
    await input.press("Enter");
    await page.waitForTimeout(1200);
  }
  const encontrado = (await textoBody()).includes(dados.equipamento);
  await shot("sistema-09-equipamento-pesquisa");
  registrar("Equipamentos", "Pesquisa", encontrado);

  const linha = page.locator("tr", { hasText: dados.equipamento }).first();
  if ((await linha.count()) === 0) {
    registrar("Equipamentos", "Edição", false, {
      motivo: "equipamento não encontrado",
    });
    return;
  }
  await linha.locator("button").first().click();
  await page.waitForTimeout(1500);
  await page.locator("#descricao").fill("Descrição QA editada");
  const beforeEdit = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(2000);
  const putReq = mutacoes
    .slice(beforeEdit)
    .find((m) => m.method === "PUT" && m.url.includes("/equipaments"));
  await shot("sistema-10-equipamento-edicao");
  registrar(
    "Equipamentos",
    "Edição",
    Boolean(putReq) && putReq.status < 400,
    { status: putReq?.status ?? null, body: putReq?.body ?? null },
  );
}

async function testarHistorico() {
  await page.goto(`${BASE}/historico-equipamentos`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1500);
  const httpErro = http.some(
    (h) => h.url.includes("historic") && h.status >= 400,
  );
  await shot("sistema-11-historico");
  registrar(
    "Histórico",
    "Listagem",
    !httpErro &&
      ((await page.locator("table").count()) > 0 ||
        /histórico|historico|nenhum/i.test(await textoBody())),
    { httpErro },
  );
}

async function testarColaboradores() {
  await page.goto(`${BASE}/colaboradores`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await shot("sistema-12-colaboradores");
  registrar(
    "Colaboradores",
    "Listagem",
    (await page.locator("table").count()) > 0 ||
      /colaborador|adicionar/i.test(await textoBody()),
  );

  if ((await page.getByRole("button", { name: /adicionar/i }).count()) > 0) {
    await page.getByRole("button", { name: /adicionar/i }).click();
    await page.waitForTimeout(1000);
    await shot("sistema-13-colaboradores-cadastro");
    registrar(
      "Colaboradores",
      "Tela de cadastro",
      /cadastrar|salvar|perfil|departamento/i.test(await textoBody()),
    );
  }
}

try {
  await login();
  await testarUsuarios();
  await testarCategorias();
  await testarTipos();
  await testarEquipamentos();
  await testarHistorico();
  await testarColaboradores();
} catch (error) {
  eventos.push({ tipo: "script", mensagem: error.message });
  await shot("sistema-erro");
  registrar("Sistema", "Execução", false, { erro: error.message });
}

const porModulo = {};
for (const t of testes) {
  if (!porModulo[t.modulo]) porModulo[t.modulo] = { passou: 0, falhou: 0, itens: [] };
  if (t.ok) porModulo[t.modulo].passou += 1;
  else porModulo[t.modulo].falhou += 1;
  porModulo[t.modulo].itens.push({
    nome: t.nome,
    ok: t.ok,
    status: t.status ?? null,
    motivo: t.motivo ?? t.body ?? null,
  });
}

const resultado = {
  dados,
  resumo: {
    total: testes.length,
    passou: testes.filter((t) => t.ok).length,
    falhou: testes.filter((t) => !t.ok).length,
  },
  porModulo,
  testes,
  mutacoes,
  http,
  eventos: eventos.slice(0, 40),
  observacao: "Departamento fora do escopo neste ciclo",
};

await fs.writeFile(
  `${ARTIFACTS}/resultados-sistema.json`,
  JSON.stringify(resultado, null, 2),
  "utf8",
);

console.log("\n=== RESUMO POR MÓDULO ===");
console.log(JSON.stringify(porModulo, null, 2));
console.log("\n=== RESUMO GERAL ===");
console.log(JSON.stringify(resultado.resumo, null, 2));

await page.waitForTimeout(1000);
await browser.close();
