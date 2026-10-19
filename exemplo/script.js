/* =========================
   1. ELEMENTOS HTML
========================= */

const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");
const elementoPontos = document.getElementById("pontos");

/* =========================
   2. CONFIGURAÇÕES DO JOGO
========================= */

const alturaChao = 50;
const posicaoChao = canvas.height - alturaChao;
const gravidade = 0.7;
const velocidadeObstaculo = 5;

let pontos = 0;
let jogoAcabou = false;
let contadorFrames = 0;
let obstaculos = [];

/* =========================
   3. PERSONAGEM
========================= */

const jogador = {
  x: 80,
  y: posicaoChao - 40,
  largura: 40,
  altura: 40,
  velocidadeY: 0,
  pulando: false,
};

/* =========================
   4. DESENHAR O CENÁRIO
========================= */

function desenharCenario() {
  // Céu
  ctx.fillStyle = "#a8dfff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sol
  ctx.fillStyle = "#ffdf55";
  ctx.beginPath();
  ctx.arc(700, 70, 30, 0, Math.PI * 2);
  ctx.fill();

  // Chão
  ctx.fillStyle = "#60b75b";
  ctx.fillRect(0, posicaoChao, canvas.width, alturaChao);
}

/* =========================
   5. DESENHAR O PERSONAGEM
========================= */

function desenharJogador() {
  ctx.fillStyle = "#3766e8";

  ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
}

/* =========================
   6. PULAR E APLICAR GRAVIDADE
========================= */

function pular() {
  if (jogoAcabou || jogador.pulando) {
    return;
  }

  jogador.velocidadeY = -13;
  jogador.pulando = true;
}

function atualizarJogador() {
  // Aplica a gravidade
  jogador.velocidadeY += gravidade;

  // Atualiza a posição vertical
  jogador.y += jogador.velocidadeY;

  // Impede que o personagem atravesse o chão
  if (jogador.y + jogador.altura >= posicaoChao) {
    jogador.y = posicaoChao - jogador.altura;
    jogador.velocidadeY = 0;
    jogador.pulando = false;
  }
}

/* =========================
   7. OBSTÁCULOS
========================= */

function criarObstaculo() {
  const obstaculo = {
    x: canvas.width,
    y: posicaoChao - 35,
    largura: 30,
    altura: 35,
  };

  obstaculos.push(obstaculo);
}

function atualizarObstaculos() {
  obstaculos.forEach((obstaculo) => {
    obstaculo.x -= velocidadeObstaculo;
  });

  // Remove os obstáculos que já saíram da tela
  obstaculos = obstaculos.filter((obstaculo) => {
    return obstaculo.x + obstaculo.largura > 0;
  });
}

function desenharObstaculos() {
  obstaculos.forEach((obstaculo) => {
    ctx.fillStyle = "#e34b4b";

    ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
  });
}

/* =========================
   8. COLISÕES
========================= */

function verificarColisoes() {
  obstaculos.forEach((obstaculo) => {
    const colidiu =
      jogador.x < obstaculo.x + obstaculo.largura &&
      jogador.x + jogador.largura > obstaculo.x &&
      jogador.y < obstaculo.y + obstaculo.altura &&
      jogador.y + jogador.altura > obstaculo.y;

    if (colidiu) {
      jogoAcabou = true;
    }
  });
}

/* =========================
   9. PONTUAÇÃO
========================= */

function atualizarPontuacao() {
  pontos += 1;

  elementoPontos.textContent = Math.floor(pontos / 10);
}

/* =========================
   10. FIM DE JOGO
========================= */

function desenharFimDeJogo() {
  ctx.fillStyle = "#222222";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";

  ctx.fillText("Fim de jogo!", canvas.width / 2, 140);

  ctx.font = "18px Arial";

  ctx.fillText(
    "Clique em Reiniciar para tentar novamente",
    canvas.width / 2,
    175,
  );

  ctx.textAlign = "left";
}

function reiniciarJogo() {
  pontos = 0;
  contadorFrames = 0;
  obstaculos = [];
  jogoAcabou = false;

  jogador.y = posicaoChao - jogador.altura;
  jogador.velocidadeY = 0;
  jogador.pulando = false;

  elementoPontos.textContent = "0";
}

/* =========================
   11. CONTROLES DO TECLADO
========================= */

window.addEventListener("keydown", function (evento) {
  if (evento.code === "Space" || evento.code === "ArrowUp") {
    evento.preventDefault();

    pular();
  }
});

/* =========================
   12. LOOP PRINCIPAL DO JOGO
========================= */

function executarJogo() {
  if (!jogoAcabou) {
    contadorFrames += 1;

    // Atualiza a posição do personagem
    atualizarJogador();

    // Cria um obstáculo a cada 100 frames
    if (contadorFrames % 100 === 0) {
      criarObstaculo();
    }

    // Movimenta os obstáculos
    atualizarObstaculos();

    // Verifica colisões
    verificarColisoes();

    // Atualiza a pontuação
    if (!jogoAcabou) {
      atualizarPontuacao();
    }
  }

  // Desenha todos os elementos
  desenharCenario();
  desenharJogador();
  desenharObstaculos();

  // Exibe a mensagem de fim de jogo
  if (jogoAcabou) {
    desenharFimDeJogo();
  }

  // Solicita o próximo quadro da animação
  requestAnimationFrame(executarJogo);
}

// Inicia o jogo
executarJogo();
