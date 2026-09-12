const G = 6.67430e-11;
const c = 299792458;
const MASSA_SOL   = 1.989e30;
const MASSA_TERRA = 5.972e24;
const DB_KEY = 'cosmos_objetos_v1';

// ── Banco local ──
function carregarDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || []; }
  catch { return []; }
}

function salvarDB(dados) {
  localStorage.setItem(DB_KEY, JSON.stringify(dados));
}

// ── Navegação ──
function showPage(id, tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (tab) tab.classList.add('active');
  if (id === 'banco') { renderTabela(); atualizarSelect(); }
}

// ── Formatação de números (sempre por extenso, nunca em notação científica) ──
function fmt(num) {
  if (num === 0 || isNaN(num)) return '0';

  const sinal = num < 0 ? '-' : '';
  num = Math.abs(num);

  const unidades = [
    { n: 'Vigintilhão',     v: 1e63 },
    { n: 'Novendecilhão',   v: 1e60 },
    { n: 'Octodecilhão',    v: 1e57 },
    { n: 'Septendecilhão',  v: 1e54 },
    { n: 'Sedecilhão',      v: 1e51 },
    { n: 'Quindecilhão',    v: 1e48 },
    { n: 'Quatordecilhão',  v: 1e45 },
    { n: 'Tredecilhão',     v: 1e42 },
    { n: 'Duodecilhão',     v: 1e39 },
    { n: 'Undecilhão',      v: 1e36 },
    { n: 'Decilhão',        v: 1e33 },
    { n: 'Nonilhão',        v: 1e30 },
    { n: 'Octilhão',        v: 1e27 },
    { n: 'Septilhão',       v: 1e24 },
    { n: 'Sextilhão',       v: 1e21 },
    { n: 'Quintilhão',      v: 1e18 },
    { n: 'Quadrilhão',      v: 1e15 },
    { n: 'Trilhão',         v: 1e12 },
    { n: 'Bilhão',          v: 1e9  },
    { n: 'Milhão',          v: 1e6  },
    { n: 'Mil',             v: 1e3  },
    { n: '',                v: 1    }
  ];

  for (const u of unidades) {
    if (num >= u.v) {
      const valNum = num / u.v;
      const valStr = valNum.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

      if (!u.n) return sinal + valStr;

      const arredondado = Math.round(valNum * 100) / 100;
      const ehSingular = Math.abs(arredondado - 1) < 1e-9;
      const nome = (/ão$/.test(u.n) && !ehSingular) ? u.n.replace(/ão$/, 'ões') : u.n;

      return sinal + `${valStr} ${nome}`;
    }
  }

  return sinal + decimalCompleto(num);
}

// Números entre 0 e 1: escreve o decimal completo, sem notação científica
function decimalCompleto(num) {
  if (num === 0) return '0';
  const exp = Math.floor(Math.log10(num));
  const casas = Math.min(100, Math.max(0, -exp) + 4);
  let str = num.toFixed(casas);
  if (str.indexOf('.') !== -1) {
    str = str.replace(/0+$/, '').replace(/\.$/, '');
  }
  return str.replace('.', ',');
}

// ── Conteúdo expandido dos cards de curiosidades ──
const CURIOSIDADES = [
  {
    icone: '🕳️',
    tag: 'Fundamentos',
    titulo: 'O que é um buraco negro?',
    texto: `Um buraco negro nasce quando uma quantidade enorme de matéria é comprimida em um espaço extremamente pequeno, criando uma gravidade tão forte que nada consegue escapar dela — nem a luz. É por isso que dizemos que um buraco negro é "invisível": ele não emite nem reflete luz.

A maioria se forma quando uma estrela muito massiva chega ao fim da vida e desaba sob o próprio peso. O material que sobra da explosão cai para um ponto extremamente denso, chamado singularidade. Ao redor dela existe uma fronteira invisível chamada horizonte de eventos: cruzar essa linha é uma viagem sem volta.

Como buracos negros não emitem luz, os cientistas não os enxergam diretamente — eles os detectam observando como afetam estrelas, gases e luz ao seu redor.`,
    fonteNome: 'NASA Space Place',
    fonteUrl: 'https://spaceplace.nasa.gov/black-holes/en/'
  },
  {
    icone: '📏',
    tag: 'Física',
    titulo: 'Raio de Schwarzschild',
    texto: `O raio de Schwarzschild é a distância a partir do centro de um objeto na qual a velocidade de escape se iguala à velocidade da luz. Se toda a massa de um objeto coubesse dentro desse raio, nem a luz conseguiria escapar dele — e ele se tornaria um buraco negro.

Ele recebe esse nome porque foi calculado em 1916 pelo físico alemão Karl Schwarzschild, poucos meses depois de Einstein publicar a Teoria da Relatividade Geral. A fórmula é simples: R = 2GM/c², onde G é a constante gravitacional, M é a massa do objeto e c é a velocidade da luz.

Quanto maior a massa, maior o raio de Schwarzschild. O Sol, por exemplo, teria esse raio em torno de 3 km — ou seja, precisaria ser espremido até esse tamanho para virar um buraco negro. Use a calculadora desta página para testar outros valores!`,
    fonteNome: 'NASA — Imagine the Universe!',
    fonteUrl: 'https://imagine.gsfc.nasa.gov/science/objects/black_holes1.html'
  },
  {
    icone: '⏳',
    tag: 'Relatividade',
    titulo: 'Distorção do tempo',
    texto: `Perto de um buraco negro, a gravidade é tão intensa que curva o espaço e o tempo ao seu redor — um efeito previsto pela Teoria da Relatividade Geral de Einstein chamado dilatação temporal gravitacional. Quanto mais perto do horizonte de eventos, mais devagar o tempo passa, na visão de quem observa de longe.

Se alguém caísse em direção a um buraco negro enquanto um amigo observasse de uma distância segura, esse amigo veria a pessoa ficar cada vez mais lenta, como em câmera lenta, sem nunca vê-la de fato cruzar o horizonte de eventos. Já para quem está caindo, o tempo passaria normalmente.

Esse efeito não é só teoria: versões bem mais fracas dele já foram medidas na Terra, inclusive em satélites de GPS, que precisam corrigir seus relógios por causa da gravidade.`,
    fonteNome: 'NASA Science',
    fonteUrl: 'https://science.nasa.gov/universe/what-happens-when-something-gets-too-close-to-a-black-hole/'
  },
  {
    icone: '✨',
    tag: 'Mecânica Quântica',
    titulo: 'Radiação Hawking',
    texto: `Em 1974, o físico Stephen Hawking mostrou que os buracos negros não são completamente eternos: eles emitem uma radiação extremamente fraca e, por isso, perdem massa aos poucos — um processo hoje chamado de radiação Hawking.

A explicação envolve um efeito estranho da mecânica quântica: mesmo o espaço "vazio" está cheio de pares de partículas que aparecem e desaparecem o tempo todo. Perto do horizonte de eventos, às vezes uma partícula do par escapa enquanto a outra cai no buraco negro — e é essa partícula escapando que compõe a radiação Hawking.

O processo é extremamente lento: um buraco negro do tamanho do Sol levaria muito mais tempo do que a idade atual do Universo inteiro para evaporar por completo.`,
    fonteNome: 'Kiddle Encyclopedia',
    fonteUrl: 'https://kids.kiddle.co/Hawking_radiation'
  },
  {
    icone: '🌌',
    tag: 'Galáxias',
    titulo: 'Buraco negro supermassivo',
    texto: `Praticamente toda galáxia grande — incluindo a nossa, a Via Láctea — tem um buraco negro supermassivo no centro. O nosso se chama Sagittarius A* (ou Sgr A*) e tem uma massa equivalente a cerca de 4 milhões de sóis, concentrada em uma região relativamente pequena.

Em 2022, a colaboração internacional Event Horizon Telescope (EHT) — uma rede de radiotelescópios espalhados pelo mundo que funcionam juntos como um único telescópio do tamanho da Terra — divulgou a primeira imagem direta de Sagittarius A*, confirmando o que os cientistas já suspeitavam havia décadas observando o movimento de estrelas ao seu redor.

Buracos negros supermassivos ajudam a moldar as galáxias em que vivem, influenciando como as estrelas se formam e se movem ao seu redor.`,
    fonteNome: 'ESO',
    fonteUrl: 'https://www.eso.org/public/news/eso2208-eht-mw/'
  },
  {
    icone: '📸',
    tag: 'História',
    titulo: 'Primeira foto real',
    texto: `Em 10 de abril de 2019, a colaboração Event Horizon Telescope (EHT) revelou a primeira imagem já feita de um buraco negro: o de M87*, localizado no centro da galáxia elíptica Messier 87, a cerca de 55 milhões de anos-luz da Terra, com massa estimada em bilhões de sóis.

A imagem mostra um anel brilhante de gás super aquecido ao redor de uma região escura — a "sombra" do horizonte de eventos, exatamente como a Relatividade Geral de Einstein previa mais de cem anos antes.

Para conseguir essa façanha, os cientistas combinaram observações de rádio telescópios espalhados por diferentes continentes, funcionando de forma sincronizada como se fossem um único telescópio do tamanho do planeta Terra.`,
    fonteNome: 'ESO',
    fonteUrl: 'https://www.eso.org/public/news/eso1907/'
  }
];

// ── Modal de detalhes ──
function abrirCard(i) {
  const dado = CURIOSIDADES[i];
  if (!dado) return;

  document.getElementById('modal-icon').textContent = dado.icone;
  document.getElementById('modal-tag').textContent = dado.tag;
  document.getElementById('modal-title').textContent = dado.titulo;
  document.getElementById('modal-text').textContent = dado.texto;
  document.getElementById('modal-source').href = dado.fonteUrl;
  document.getElementById('modal-source-nome').textContent = dado.fonteNome;

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') fecharModal();
});

// ── Física ──
function massaDe(raio) { return (raio * c * c) / (2 * G); }
function raioDe(massa) { return (2 * G * massa) / (c * c); }

// ── Schwarzschild ──
function calcularSchw() {
  const r = parseFloat(document.getElementById('raio').value);
  const el = document.getElementById('resultado-schw');
  if (isNaN(r) || r <= 0) {
    el.textContent = 'Digite um valor de raio válido (maior que zero).';
    el.classList.add('visible'); return;
  }
  const massa = massaDe(r);
  el.innerHTML =
`<span style="color:#90E0EF; font-weight:500;">Raio inserido</span>
  ${fmt(r)} m

<span style="color:#90E0EF; font-weight:500;">Massa do buraco negro</span>
  ${fmt(massa)} kg
  ≈ ${fmt(massa / MASSA_TERRA)} massas da Terra
  ≈ ${fmt(massa / MASSA_SOL)} massas solares`;
  el.classList.add('visible');
}

// ── Adicionar objeto ──
function adicionarObjeto() {
  const nome  = document.getElementById('db-nome').value.trim();
  const massa = parseFloat(document.getElementById('db-massa').value);
  if (!nome)            { showToast('Informe um nome para o objeto.'); return; }
  if (isNaN(massa) || massa <= 0) { showToast('Informe uma massa válida (> 0).'); return; }

  const dados = carregarDB();
  dados.push({ id: Date.now(), nome, massa });
  salvarDB(dados);

  document.getElementById('db-nome').value  = '';
  document.getElementById('db-massa').value = '';

  renderTabela();
  atualizarSelect();
  showToast(`"${nome}" salvo com sucesso!`);
}

// ── Remover objeto ──
function removerObjeto(id) {
  const dados = carregarDB().filter(o => o.id !== id);
  salvarDB(dados);
  renderTabela();
  atualizarSelect();
  showToast('Objeto removido.');
}

// ── Calcular com objeto ──
function calcularComObjeto() {
  const id = parseInt(document.getElementById('db-select').value);
  const raioCustom = parseFloat(document.getElementById('db-raio').value);
  const el = document.getElementById('resultado-db');

  if (!id) { showToast('Selecione um objeto antes de calcular.'); return; }

  const dados = carregarDB();
  const obj = dados.find(o => o.id === id);
  if (!obj) return;

  const usouRaioCustom = !isNaN(raioCustom) && raioCustom > 0;
  const massaAlvo = usouRaioCustom ? massaDe(raioCustom) : MASSA_SOL;
  const raioAlvo  = raioDe(massaAlvo);
  const qtd       = massaAlvo / obj.massa;
  const label     = usouRaioCustom
    ? `buraco negro com raio ${fmt(raioCustom)} m`
    : 'buraco negro equivalente ao Sol';

  el.innerHTML =
`<span style="color:#90E0EF; font-weight:500;">Objeto selecionado</span>
  ${esc(obj.nome)}
  Massa unitária: ${fmt(obj.massa)} kg

<span style="color:#90E0EF; font-weight:500;">Buraco negro alvo</span>  (${label})
  Massa: ${fmt(massaAlvo)} kg  (≈ ${fmt(massaAlvo / MASSA_SOL)} massas solares)
  Raio de Schwarzschild: ${fmt(raioAlvo)} m

<span style="color:#C77DFF; font-weight:500; font-size:15px;">Quantidade necessária</span>
  <span style="font-size:20px; color:#fff; font-weight:500;">${fmt(qtd)}</span> unidades de "${esc(obj.nome)}"`;

  el.classList.add('visible', 'fade-in');
  setTimeout(() => el.classList.remove('fade-in'), 500);
}

// ── Renderizar tabela ──
function renderTabela() {
  const dados  = carregarDB();
  const tbody  = document.getElementById('tabela-corpo');
  const empty  = document.getElementById('empty-state');

  if (dados.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  tbody.innerHTML = dados.map(obj => {
    const qtdSol   = MASSA_SOL / obj.massa;
    const raioProp = raioDe(obj.massa);
    return `<tr>
      <td class="td-name">${esc(obj.nome)}</td>
      <td class="td-mono">${fmt(obj.massa)} kg</td>
      <td class="td-purple">${fmt(qtdSol)}</td>
      <td class="td-mono">${fmt(raioProp)} m</td>
      <td><button class="btn-danger" onclick="removerObjeto(${obj.id})">Remover</button></td>
    </tr>`;
  }).join('');
}

// ── Atualizar select ──
function atualizarSelect() {
  const dados = carregarDB();
  const sel   = document.getElementById('db-select');
  sel.innerHTML = '<option value="">Selecione um objeto...</option>' +
    dados.map(o => `<option value="${o.id}">${esc(o.nome)} — ${fmt(o.massa)} kg</option>`).join('');
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Ripple ──
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const r = document.createElement('span');
  r.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - rect.left - size / 2) + 'px';
  r.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
});

// ── Enter nos inputs ──
document.getElementById('raio').addEventListener('keydown', e => { if (e.key === 'Enter') calcularSchw(); });

// ── Init ──
atualizarSelect();
