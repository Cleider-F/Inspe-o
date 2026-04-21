const id = new URLSearchParams(location.search).get("id");

let compartimentos = [];

const box = document.getElementById("itens");
const info = document.getElementById("info");


// 🔹 CARREGAR
db.collection("inspecoes").doc(id).get().then(doc => {
  const d = doc.data();

  info.innerHTML = `<b>${d.identificacao}</b> | ${d.tipo}`;

  compartimentos = d.compartimentos || [];

  render();
});


// 🔹 RENDER
function render() {
  box.innerHTML = "";

  compartimentos.forEach((comp, cIdx) => {

    const divComp = document.createElement("div");
    divComp.className = "card";

    divComp.innerHTML = `
      <b>Compartimento ${comp.nome}</b>
      <button class="danger" onclick="remCompartimento(${cIdx})">Remover</button>
      <div id="itens-${cIdx}"></div>
      <button onclick="addItem(${cIdx})">+ Avaria</button>
    `;

    box.appendChild(divComp);

    const itensDiv = divComp.querySelector(`#itens-${cIdx}`);

    comp.itens.forEach((i, iIdx) => {
      const itemDiv = document.createElement("div");

      itemDiv.innerHTML = `
        <input value="${i.item || ""}" placeholder="Item"
          oninput="compartimentos[${cIdx}].itens[${iIdx}].item=this.value">

        <input value="${i.descricao || ""}" placeholder="Descrição"
          oninput="compartimentos[${cIdx}].itens[${iIdx}].descricao=this.value">

        <button class="danger" onclick="remItem(${cIdx}, ${iIdx})">Remover</button>
      `;

      itensDiv.appendChild(itemDiv);
    });
  });
}


// 🔹 ADICIONAR COMPARTIMENTO
function addCompartimento() {
  const nome = prompt("Nome do compartimento (ex: C1, Tanque 2, Eixo 3):");

  if (!nome || nome.trim() === "") {
    alert("Informe um nome válido");
    return;
  }

  compartimentos.push({
    nome,
    itens: []
  });

  render();
}


// 🔹 REMOVER COMPARTIMENTO
function remCompartimento(idx) {
  compartimentos.splice(idx, 1);
  render();
}


// 🔹 ADICIONAR ITEM
function addItem(cIdx) {
  compartimentos[cIdx].itens.push({
    item: "",
    descricao: "",
    corrigido: false
  });

  render();
}


// 🔹 REMOVER ITEM
function remItem(cIdx, iIdx) {
  compartimentos[cIdx].itens.splice(iIdx, 1);
  render();
}


// 🔹 SALVAR
function salvar() {

  if (!compartimentos.length) {
    alert("Adicione pelo menos um compartimento");
    return;
  }

  for (let comp of compartimentos) {
    if (!comp.nome || comp.nome.trim() === "") {
      alert("Todos os compartimentos devem ter nome");
      return;
    }

    if (!comp.itens.length) {
      alert(`O compartimento ${comp.nome} não possui avarias`);
      return;
    }

    for (let item of comp.itens) {
      if (!item.item || !item.descricao) {
        alert(`Preencha todos os itens do compartimento ${comp.nome}`);
        return;
      }
    }
  }

  db.collection("inspecoes").doc(id).update({
    compartimentos,
    status: "AGUARDANDO_MANUTENCAO"
  }).then(() => {
    alert("Inspeção finalizada");
    location = "index.html";
  });
}

function go(url) {
  window.location.href = url;
}