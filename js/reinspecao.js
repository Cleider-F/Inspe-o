const id = new URLSearchParams(window.location.search).get("id");

let compartimentos = [];

const container = document.getElementById("itens");
const info = document.getElementById("info");


// 🔹 CARREGAR DADOS
db.collection("inspecoes").doc(id).get().then(doc => {
  const d = doc.data();

  info.innerHTML = `<b>${d.identificacao}</b> | ${d.tipo}`;

  // 🔸 Justificativa da manutenção
  if (d.justificativaPendencia) {
    const aviso = document.createElement("div");
    aviso.className = "card";
    aviso.style.background = "#fff3cd";

    aviso.innerHTML = `
      <b>Justificativa da manutenção:</b><br>
      ${d.justificativaPendencia}
    `;

    container.appendChild(aviso);
  }

  compartimentos = d.compartimentos || [];
  render();
});


// 🔹 RENDER
function render() {
  container.innerHTML = container.innerHTML; // mantém aviso

  if (!compartimentos.length) {
    container.innerHTML += "<p>Nenhuma avaria registrada</p>";
    return;
  }

  compartimentos.forEach((comp) => {

    const titulo = document.createElement("h3");
    titulo.innerText = `Compartimento ${comp.nome}`;
    container.appendChild(titulo);

    comp.itens.forEach((item) => {

      const div = document.createElement("div");
      div.className = "card";

      div.style.borderLeft = item.corrigido
        ? "5px solid #10b981"
        : "5px solid #dc2626";

      div.innerHTML = `
        <b>${item.item}</b><br>
        ${item.descricao}<br><br>

        <span style="font-weight:bold; color:${item.corrigido ? "#10b981" : "#dc2626"}">
          ${item.corrigido ? "✔ Corrigido" : "✖ Pendente"}
        </span>
      `;

      container.appendChild(div);
    });
  });
}


// 🔹 APROVAR
function aprovar() {

  const todosItens = compartimentos.flatMap(c => c.itens);

  const pendentes = todosItens.some(i => !i.corrigido);

  if (pendentes) {
    alert("Ainda existem itens pendentes. Não é possível aprovar.");
    return;
  }

  db.collection("inspecoes").doc(id).update({
    status: "LIBERADO",
    observacaoReprovacao: "",
    justificativaPendencia: ""
  }).then(() => {
    alert("Implemento liberado");
    window.location.href = "index.html";
  });
}


// 🔹 REPROVAR
function reprovar() {
  const obs = prompt("Informe o motivo da reprovação:");

  if (!obs || obs.trim() === "") {
    alert("Motivo obrigatório");
    return;
  }

  db.collection("inspecoes").doc(id).update({
    status: "AGUARDANDO_MANUTENCAO",
    observacaoReprovacao: obs
  }).then(() => {
    alert("Reprovado e enviado para manutenção");
    window.location.href = "index.html";
  });
}

function go(url) {
  window.location.href = url;
}