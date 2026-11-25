import { chromium } from "playwright";
import fs from "node:fs/promises";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5173";
const ARTIFACTS = "qa-artifacts";
const agora = Date.now().toString().slice(-8);

const dados = {
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
  slowMo: 180,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();

const testes = [];
const http = [];
const mutacoes = [];
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
  await page.screenshot({
    path: `${ARTIFACTS}/${nome}.png`,
    fullPage: true,
  });
}

async function textoBody() {
  return page.locator("body").innerText();
}

async function selectPrimeiraOpcao(selector) {
  const select = page.locator(selector);
  const options = await select.locator("option").all();
  for (let i = 0; i < options.length; i++) {
    const value = await options[i].getAttribute("value");
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
  await shot("mod-01-login");
  registrar("Auth", "Login", page.url().includes("/users"), {
    url: page.url(),
  });
}

async function testarCategorias() {
  await page.goto(`${BASE}/categorias`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const listOk =
    (await page.locator("table").count()) > 0 ||
    /categoria|adicionar/i.test(await textoBody());
  await shot("mod-02-categorias-lista");
  registrar("Categorias", "Listagem", listOk, { url: page.url() });

  await page.getByRole("button", { name: /adicionar/i }).click();
  await page.waitForTimeout(800);
  await page.locator("#nome").fill(dados.categoria);
  await page.locator("#tipo").selectOption("AT");
  await page.locator("#nota").fill("Nota QA categoria");

  const before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(1800);

  const createReq = mutacoes
    .slice(before)
    .find((m) => m.method === "POST" && m.url.includes("/categoria"));
  const cadastroOk =
    Boolean(createReq) &&
    createReq.status < 400 &&
    (page.url().includes("/categorias") ||
      (await textoBody()).includes(dados.categoria));

  await shot("mod-03-categorias-cadastro");
  registrar("Categorias", "Cadastro", cadastroOk, {
    status: createReq?.status ?? null,
    url: page.url(),
    body: createReq?.body ?? null,
  });

  await page.goto(`${BASE}/categorias`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const linha = page.locator("tr", { hasText: dados.categoria }).first();
  if ((await linha.count()) === 0) {
    registrar("Categorias", "Edição", false, {
      motivo: "Categoria não encontrada na lista",
    });
    await shot("mod-04-categorias-edicao-bloqueada");
    return;
  }

  await linha.locator("button").first().click();
  await page.waitForTimeout(1200);
  const formCarregou = (await page.locator("#nome").inputValue()) !== "";
  if (formCarregou) {
    await page.locator("#nome").fill(dados.categoriaEdit);
  }

  const beforeEdit = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(1800);

  const putReq = mutacoes
    .slice(beforeEdit)
    .find((m) => m.method === "PUT" && m.url.includes("/categoria"));
  await shot("mod-04-categorias-edicao");
  registrar("Categorias", "Edição", Boolean(putReq) && putReq.status < 400, {
    status: putReq?.status ?? null,
    urlReq: putReq?.url ?? null,
    urlPage: page.url(),
    formCarregou,
    body: putReq?.body ?? null,
  });
}

async function testarTipos() {
  await page.goto(`${BASE}/tipo-equipamento`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const listOk =
    (await page.locator("table").count()) > 0 ||
    /tipo|adicionar/i.test(await textoBody());
  await shot("mod-05-tipos-lista");
  registrar("Tipo Equipamento", "Listagem", listOk, { url: page.url() });

  await page.getByRole("button", { name: /adicionar/i }).click();
  await page.waitForTimeout(800);
  await page.locator("#nome").fill(dados.tipo);
  await page.locator("#nota").fill("Nota QA tipo");

  const before = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(2000);

  const createReq = mutacoes
    .slice(before)
    .find(
      (m) =>
        m.method === "POST" &&
        (m.url.includes("/tipo_equipamento") || m.url.includes("/tipo")),
    );
  await shot("mod-06-tipos-cadastro");
  registrar(
    "Tipo Equipamento",
    "Cadastro",
    Boolean(createReq) && createReq.status < 400,
    {
      status: createReq?.status ?? null,
      urlReq: createReq?.url ?? null,
      urlPage: page.url(),
      body: createReq?.body ?? null,
    },
  );

  await page.goto(`${BASE}/tipo-equipamento`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const linha = page.locator("tr", { hasText: dados.tipo }).first();
  if ((await linha.count()) === 0) {
    registrar("Tipo Equipamento", "Edição", false, {
      motivo: "Tipo não encontrado na lista",
    });
    await shot("mod-07-tipos-edicao-bloqueada");
    return;
  }

  await linha.locator("button").first().click();
  await page.waitForTimeout(1200);
  const formCarregou = (await page.locator("#nome").inputValue()) !== "";
  if (formCarregou) {
    await page.locator("#nome").fill(dados.tipoEdit);
  }

  const beforeEdit = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(2000);
  const putReq = mutacoes
    .slice(beforeEdit)
    .find(
      (m) =>
        m.method === "PUT" &&
        (m.url.includes("/tipo_equipamento") || m.url.includes("/tipo")),
    );
  await shot("mod-07-tipos-edicao");
  registrar(
    "Tipo Equipamento",
    "Edição",
    Boolean(putReq) && putReq.status < 400,
    {
      status: putReq?.status ?? null,
      urlReq: putReq?.url ?? null,
      formCarregou,
      body: putReq?.body ?? null,
    },
  );
}

async function testarEquipamentos() {
  await page.goto(`${BASE}/equipamentos`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const listOk =
    (await page.locator("table").count()) > 0 ||
    /equipamento|adicionar/i.test(await textoBody());
  await shot("mod-08-equipamentos-lista");
  registrar("Equipamentos", "Listagem", listOk, { url: page.url() });

  await page.getByRole("button", { name: /adicionar/i }).click();
  await page.waitForTimeout(1500);

  await page.locator("#nome").fill(dados.equipamento);
  await page.locator("#serie").fill(dados.serie);
  const statusOk = await selectPrimeiraOpcao("#status_id");
  const usuarioOk = await selectPrimeiraOpcao("#usuario_id");
  await page.locator("#descricao").fill("Descrição QA equipamento");
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

  await shot("mod-09-equipamentos-cadastro");
  registrar(
    "Equipamentos",
    "Cadastro",
    Boolean(createReq) && createReq.status < 400 && page.url().includes("/equipamentos"),
    {
      status: createReq?.status ?? null,
      urlReq: createReq?.url ?? null,
      urlPage: page.url(),
      statusSelecionado: Boolean(statusOk),
      usuarioSelecionado: Boolean(usuarioOk),
      body: createReq?.body ?? null,
      payload: createReq?.postData ?? null,
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
  const texto = await textoBody();
  await shot("mod-10-equipamentos-pesquisa");
  registrar("Equipamentos", "Pesquisa", texto.includes(dados.equipamento), {
    trecho: texto.slice(0, 400),
  });

  const linha = page.locator("tr", { hasText: dados.equipamento }).first();
  if ((await linha.count()) === 0) {
    registrar("Equipamentos", "Edição", false, {
      motivo: "Equipamento não encontrado",
    });
    await shot("mod-11-equipamentos-edicao-bloqueada");
    return;
  }

  await linha.locator("button").first().click();
  await page.waitForTimeout(1500);
  const formCarregou = (await page.locator("#nome").inputValue()) !== "";
  if (formCarregou) {
    await page.locator("#descricao").fill("Descrição QA editada");
  }
  const beforeEdit = mutacoes.length;
  await page.getByRole("button", { name: /salvar/i }).click();
  await page.waitForTimeout(2000);
  const putReq = mutacoes
    .slice(beforeEdit)
    .find((m) => m.method === "PUT" && m.url.includes("/equipaments"));
  await shot("mod-11-equipamentos-edicao");
  registrar(
    "Equipamentos",
    "Edição",
    Boolean(putReq) && putReq.status < 400,
    {
      status: putReq?.status ?? null,
      formCarregou,
      body: putReq?.body ?? null,
    },
  );
}

async function testarHistorico() {
  await page.goto(`${BASE}/historico-equipamentos`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1500);
  const texto = await textoBody();
  const pageError = eventos.some(
    (e) =>
      e.tipo === "pageerror" &&
      e.url?.includes("historico-equipamentos"),
  );
  const httpErro = http.some(
    (h) =>
      h.url.includes("historic") &&
      h.status >= 400 &&
      !mutacoes.some((m) => m.url === h.url && m.method !== "GET"),
  );
  const listOk =
    !pageError &&
    ((await page.locator("table").count()) > 0 ||
      /histórico|historico|nenhum|sem registro|total/i.test(texto));

  await shot("mod-12-historico");
  registrar("Histórico", "Listagem", listOk && !httpErro, {
    url: page.url(),
    httpErro,
    trecho: texto.slice(0, 500),
  });
}

async function testarColaboradores() {
  await page.goto(`${BASE}/colaboradores`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const texto = await textoBody();
  const listOk =
    (await page.locator("table").count()) > 0 ||
    /colaborador|adicionar/i.test(texto);
  await shot("mod-13-colaboradores");
  registrar("Colaboradores", "Listagem", listOk, {
    url: page.url(),
    trecho: texto.slice(0, 400),
  });

  if ((await page.getByRole("button", { name: /adicionar/i }).count()) > 0) {
    await page.getByRole("button", { name: /adicionar/i }).click();
    await page.waitForTimeout(1000);
    const formOk = /cadastrar|salvar|perfil|departamento/i.test(
      await textoBody(),
    );
    await shot("mod-14-colaboradores-cadastro");
    registrar("Colaboradores", "Tela de cadastro", formOk, {
      url: page.url(),
    });
  }
}

async function testarDepartamentosMenu() {
  await page.goto(`${BASE}/departamentos`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const url = page.url();
  const ok = url.includes("/departamentos") && !url.includes("/auth");
  await shot("mod-15-departamentos");
  registrar("Departamentos", "Rota do menu", ok, { url });
}

try {
  await login();
  await testarCategorias();
  await testarTipos();
  await testarEquipamentos();
  await testarHistorico();
  await testarColaboradores();
  await testarDepartamentosMenu();
} catch (error) {
  eventos.push({ tipo: "script", mensagem: error.message });
  await shot("mod-erro");
  registrar("Sistema", "Execução do script", false, { erro: error.message });
}

const porModulo = {};
for (const t of testes) {
  if (!porModulo[t.modulo]) {
    porModulo[t.modulo] = { passou: 0, falhou: 0, itens: [] };
  }
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
  eventos: eventos.slice(0, 50),
};

await fs.writeFile(
  `${ARTIFACTS}/resultados-modulos.json`,
  JSON.stringify(resultado, null, 2),
  "utf8",
);

console.log("\n=== RESUMO POR MÓDULO ===");
console.log(JSON.stringify(porModulo, null, 2));
console.log("\n=== RESUMO GERAL ===");
console.log(JSON.stringify(resultado.resumo, null, 2));

await page.waitForTimeout(1200);
await browser.close();
