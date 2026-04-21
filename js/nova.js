function criar() {
  const tipoEl = document.getElementById("tipo");
  const identificacaoEl = document.getElementById("identificacao");

  const tipo = tipoEl.value;
  const identificacao = identificacaoEl.value;

  if (!identificacao) {
    alert("Preencha a identificação");
    return;
  }

  db.collection("inspecoes").add({
    tipo,
    identificacao,
    status: "EM_INSPECAO",
    itens: [],
    dataInspecao: new Date()
  }).then(doc => {
    window.location.href = `inspecao.html?id=${doc.id}`;
  });
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

function go(url) {
  window.location.href = url;
}