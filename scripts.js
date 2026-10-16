var tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");

var listaDeTarefas = document.getElementById("lista-tarefas");
var inputTarefa = document.getElementById("input-tarefa");

function salvarTarefasLocalStorage() {
    var json = JSON.stringify(tarefas);
    localStorage.setItem("tarefas", json)
}   

function adicionarTarefa() {
    // PEGAR O TEXTO QUE USUARIO DIGITOU
    var texto = inputTarefa.value.trim();

    // VALIDAÇÃO DO TEXTO
    if(texto === ""){
        alert("VOCÊ PRECISA DIGITAR ALGO NO CAMPO PARA ADICIONAR!!!")
        return;
    }

    // VALIDAÇÃO DE TAMANHO
    if(texto.length <= 3){
        alert("O TEXTO PRECISA TER MAIS DE 3 CARACTERES");
        return;
    }

    // CRIAR O OBJETO QUE REPRESENTA A TAREFA;
    var novaTarefa = {
        id: tarefas.length ? tarefas[tarefas.length - 1].id + 1 : 1, 
        texto: texto,
        concluida: false
    }

    // ADICIONA NA LISTA 
    tarefas.push(novaTarefa);

    salvarTarefasLocalStorage();

    // DESENHAR TELA
    desenharTarefas();

    // RESETA O TEXTO DO INPUT
    inputTarefa.value = "";
}

function excluirTarefa(id) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);
    salvarTarefasLocalStorage();
    desenharTarefas();
}

function alternarTarefa(id) {
    var tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (tarefa !== undefined) {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefasLocalStorage();
        desenharTarefas();
    }
}

function desenharTarefas() {
    listaDeTarefas.innerHTML = "";

    for (var i = 0; i < tarefas.length; i++) {
        var icone = tarefas[i].concluida ? "radio_button_checked" : "radio_button_unchecked";
        var classes = tarefas[i].concluida ? "tarefa tarefa-concluida" : "tarefa";

        listaDeTarefas.innerHTML += ` 
            <li class="${classes}">
                <button class="botao-check" onclick="alternarTarefa(${tarefas[i].id})">
                    <span class="material-symbols-outlined">
                        ${icone}
                    </span>
                </button>
    
                <span class="tarefa-texto">
                    ${tarefas[i].texto}
                </span>
    
                <button class="botao-excluir" onclick="excluirTarefa(${tarefas[i].id})">
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                </button>
            </li>
        `;
    }
}

desenharTarefas();