const id = new URLSearchParams(window.location.search).get("id");

let compartimentos = [];

const container = document.getElementById("itens");
const info = document.getElementById("info");


// 🔹 CARREGAR DADOS
db.collection("inspecoes").doc(id).get().then(doc => {
  const d = doc.data();

  info.innerHTML = `<b>${d.identificacao}</b> | ${d.tipo}`;

  // aviso de reprovação anterior
  if (d.observacaoReprovacao) {
    const aviso = document.createElement("div");
    aviso.className = "card";
    aviso.style.background = "#ffe0e0";

    aviso.innerHTML = `
      <b>Motivo da reprovação:</b><br>
      ${d.observacaoReprovacao}
    `;

    container.appendChild(aviso);
  }

  compartimentos = d.compartimentos || [];
  render();
});


// 🔹 RENDER
function render() {
  container.innerHTML = "";

  if (!compartimentos.length) {
    container.innerHTML = "<p>Nenhuma avaria registrada</p>";
    return;
  }

  compartimentos.forEach((comp, cIdx) => {

    const titulo = document.createElement("h3");
    titulo.innerText = `Compartimento ${comp.nome}`;
    container.appendChild(titulo);

    comp.itens.forEach((item, iIdx) => {

      const div = document.createElement("div");
      div.className = "card";

      // destaque visual
      div.style.borderLeft = item.corrigido
        ? "5px solid #10b981"
        : "5px solid #dc2626";

      div.innerHTML = `
  <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
    
    <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
      <input type="checkbox"
        ${item.corrigido ? "checked" : ""}
        onchange="marcar(${cIdx}, ${iIdx}, this.checked)">
      Corrigido
    </label>

  </div>

  <div>
    <b>${item.item}</b><br>
    <small>${item.descricao}</small>
  </div>
`;

      container.appendChild(div);
    });
  });
}


// 🔹 MARCAR ITEM
function marcar(cIdx, iIdx, valor) {
  compartimentos[cIdx].itens[iIdx].corrigido = valor;
  render(); // re-render para atualizar cor
}


// 🔹 FINALIZAR MANUTENÇÃO
function finalizar() {

  // flatten de todos os itens
  const todosItens = compartimentos.flatMap(c => c.itens);

  // ❌ nenhum corrigido
  const nenhumCorrigido = !todosItens.some(i => i.corrigido);

  if (nenhumCorrigido) {
    alert("Marque pelo menos um item como corrigido");
    return;
  }

  // ❌ itens pendentes
  const pendentes = todosItens.filter(i => !i.corrigido);

  let justificativa = "";

  if (pendentes.length > 0) {
    justificativa = prompt("Existem itens pendentes.\nInforme o motivo:");

    if (!justificativa || justificativa.trim() === "") {
      alert("Justificativa obrigatória");
      return;
    }
  }

  db.collection("inspecoes").doc(id).update({
    compartimentos,
    status: "AGUARDANDO_REINSPECAO",
    justificativaPendencia: justificativa
  }).then(() => {
    alert("Manutenção finalizada");
    window.location.href = "index.html";
  });
}

function go(url) {
  window.location.href = url;
}