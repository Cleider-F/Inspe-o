const lista = document.getElementById("lista");
const contadoresDiv = document.getElementById("contadores");

let dados = [];

function carregar() {
  db.collection("inspecoes").onSnapshot(snap => {
    dados = [];

    snap.forEach(doc => {
      dados.push({ id: doc.id, ...doc.data() });
    });

    atualizarContadores();
    render();
  });
}

function atualizarContadores() {
  const total = dados.length;
  const manutencao = dados.filter(d => d.status === "AGUARDANDO_MANUTENCAO").length;
  const reinspecao = dados.filter(d => d.status === "AGUARDANDO_REINSPECAO").length;
  const liberado = dados.filter(d => d.status === "LIBERADO").length;

  contadoresDiv.innerHTML = `
    <div class="counter"><strong>${total}</strong>Total</div>
    <div class="counter"><strong>${manutencao}</strong>Manutenção</div>
    <div class="counter"><strong>${reinspecao}</strong>Reinspeção</div>
    <div class="counter"><strong>${liberado}</strong>Liberado</div>
  `;
}

function aplicarFiltros() {
  render();
}

function render() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const filtroStatus = document.getElementById("filtroStatus").value;

  lista.innerHTML = "";

  let filtrados = dados.filter(d => {
    const matchBusca = d.identificacao.toLowerCase().includes(busca);
    const matchStatus = filtroStatus === "TODOS" || d.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  filtrados.forEach(d => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
  <b>${d.identificacao}</b><br>
  Tipo: ${d.tipo}<br>
  <span class="status-badge ${getStatusClass(d.status)}">
  ${d.status}
</span><br><br>

  <button onclick="abrir('${d.id}', '${d.status}')">
    Abrir
  </button>

  <button class="danger" onclick="excluir('${d.id}')">
    Excluir
  </button>
`;

    lista.appendChild(div);
  });
}

function abrir(id, status) {
  if (status === "EM_INSPECAO") location = `inspecao.html?id=${id}`;
  else if (status === "AGUARDANDO_MANUTENCAO") location = `manutencao.html?id=${id}`;
  else if (status === "AGUARDANDO_REINSPECAO") location = `reinspecao.html?id=${id}`;
}

function nova() {
  location = "nova.html";
}

function excluir(id) {
  const confirmar = confirm("Tem certeza que deseja excluir esta inspeção?");

  if (!confirmar) return;

  db.collection("inspecoes").doc(id).delete()
    .then(() => {
      alert("Inspeção excluída");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao excluir");
    });
}

function getStatusClass(status) {
  if (status === "EM_INSPECAO") return "status-em";
  if (status === "AGUARDANDO_MANUTENCAO") return "status-manutencao";
  if (status === "AGUARDANDO_REINSPECAO") return "status-reinspecao";
  if (status === "LIBERADO") return "status-liberado";
  return "";
}

function go(url) {
  window.location.href = url;
}
const path = window.location.pathname;

if (path.includes("index")) {
  document.getElementById("nav-dashboard")?.classList.add("active");
}

if (path.includes("nova")) {
  document.getElementById("nav-nova")?.classList.add("active");
}
carregar();

function go(url) {
  window.location.href = url;
}