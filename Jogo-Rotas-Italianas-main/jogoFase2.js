const gabriel = document.querySelector('.pessoa1');
const madeira = document.querySelector('.madeira');
const passaro = document.querySelector('.passaro');
const sol = document.querySelector('.sol');
const background = document.querySelector('.game-board');
const pontoEl = document.getElementById('ponto');
const morteEl = document.getElementById('morte');
const reiniciarId = document.getElementById('reiniciar');
const inicioId = document.getElementById('inicio');
const faseEl = document.getElementById('fase');

const introScreen = document.getElementById('intro-screen');
const startBtn = document.getElementById('start-btn');

let pontos = 0;
let mortes = 0;
let jogoAtivo = false;
let loopColisao;
let loopPontos;
let fase = 1;
let vezDoTronco = true;   // controla quem está ativo
let agachado = false;
const pontosPorFase = 16;

// Durações atuais (usadas p/ reiniciar animação preservando velocidade)
let durMadeira = 1.5;
let durPassaro = 1.8;

// ===========================
// Botão Start
startBtn.addEventListener('click', () => {
    introScreen.style.display = 'none';
    iniciarJogo();
});

// ===========================
// Função de pulo
const jump = () => {
    if (!jogoAtivo) return;
    gabriel.classList.add('jump');
    setTimeout(() => gabriel.classList.remove('jump'), 600);
};

// ===========================
// Helpers para ativar um obstáculo de cada vez (reinicia animação no início da tela)
function ativarTronco() {
    vezDoTronco = true;
    passaro.classList.remove('ativo');
    madeira.classList.add('ativo');

    // reinicia o ciclo pra sempre começar fora da tela à direita
    madeira.style.animation = 'none';
    void madeira.offsetWidth;
    madeira.style.animation = `madeira-animation ${durMadeira}s linear infinite`;
}

function ativarPassaro() {
    vezDoTronco = false;
    madeira.classList.remove('ativo');
    passaro.classList.add('ativo');

    // reinicia o ciclo pra sempre começar fora da tela à direita
    passaro.style.animation = 'none';
    void passaro.offsetWidth;
    passaro.style.animation = `passaro-animation ${durPassaro}s linear infinite`;
}

// ===========================
// Alternar quando o obstáculo ATUAL terminar um ciclo
madeira.addEventListener('animationiteration', () => {
    if (vezDoTronco) ativarPassaro();
});

passaro.addEventListener('animationiteration', () => {
    if (!vezDoTronco) ativarTronco();
});

// ===========================
// Fim de jogo
function fimDeJogo() {
    mortes++;
    morteEl.textContent = `Mortes: ${mortes}`;
    jogoAtivo = false;

    sol.style.animationPlayState = 'paused';
    madeira.style.animationPlayState = 'paused';
    passaro.style.animationPlayState = 'paused';
    gabriel.style.animationPlayState = 'paused';

    const gabrielBottom = parseFloat(getComputedStyle(gabriel).bottom);
    gabriel.style.animation = 'none';
    gabriel.style.bottom = `${gabrielBottom}px`;

    sol.src = './img/Lua.png';
    sol.style.width = '190px';
    background.style.background = 'linear-gradient(#060057, #0051ffa6)';

    gabriel.src = 'img/Ramthum triste.png';
    gabriel.style.width = '90px';
    gabriel.style.marginLeft = '25px';

    clearInterval(loopColisao);
    clearInterval(loopPontos);

    reiniciarId.style.visibility = 'visible';
    inicioId.style.visibility = 'visible';
}

// ===========================
// Loop de colisão (checa só quem está .ativo)
function startLoop() {
    loopColisao = setInterval(() => {
        if (!jogoAtivo) return;

        const gabrielPosition = +getComputedStyle(gabriel).bottom.replace('px', '');

        // Tronco ativo?
        if (madeira.classList.contains('ativo')) {
            const madeiraPosition = +getComputedStyle(madeira).left.replace('px', '');
            if (madeiraPosition <= 118 && madeiraPosition > 0 && gabrielPosition < 50) {
                fimDeJogo();
            }
        }

        // Pássaro ativo?
        if (passaro.classList.contains('ativo')) {
            const passaroPosition = +getComputedStyle(passaro).left.replace('px', '');
            // só mata se NÃO estiver agachado
            if (passaroPosition <= 118 && passaroPosition > 0 && !agachado) {
                fimDeJogo();
            }
        }
    }, 5);
}

// ===========================
// Iniciar/Reiniciar
function iniciarJogo() {
    jogoAtivo = true;
    reiniciarId.style.visibility = 'hidden';
    inicioId.style.visibility = 'hidden';
    pontos = 0;
    pontoEl.textContent = `Pontos: ${pontos}`;

    // Resetar posições
    madeira.style.left = '';
    passaro.style.left = '';
    sol.style.left = '';
    gabriel.style.bottom = '';

    // Resetar animações
    madeira.style.animation = 'none';
    passaro.style.animation = 'none';
    sol.style.animation = 'none';
    void madeira.offsetWidth; void passaro.offsetWidth; void sol.offsetWidth;

    gabriel.style.animation = '';

    // Começa com TRONCO
    madeira.classList.add('ativo');
    passaro.classList.remove('ativo');
    vezDoTronco = true;

    // Aplica animações com as durações atuais
    madeira.style.animation = `madeira-animation ${durMadeira}s linear infinite`;
    passaro.style.animation = `passaro-animation ${durPassaro}s linear infinite`;
    sol.style.animation = 'sol-animation 20s linear infinite';

    // Visual normal
    sol.src = './img/sol.png';
    sol.style.width = '240px';
    background.style.background = `url('img/floresta.jpg') no-repeat center center`;
    background.style.backgroundSize = 'cover';
    background.style.imageRendering = 'pixelated';

    gabriel.src = 'img/Gaybriel Ranthum.gif';
    gabriel.style.width = '140px';
    gabriel.style.marginLeft = '0';
    gabriel.style.marginBottom = '0';

    // Rodar
    madeira.style.animationPlayState = 'running';
    passaro.style.animationPlayState = 'running';
    sol.style.animationPlayState = 'running';
    gabriel.style.animationPlayState = 'running';

    // Loops
    startLoop();
    loopPontos = setInterval(() => {
        if (jogoAtivo) {
            pontos++;
            pontoEl.textContent = `Pontos: ${pontos}`;
            if (pontos % pontosPorFase === 0) mudarDeFase();
        }
    }, 1000);
}

// ===========================
// Botões
reiniciarId.addEventListener('click', iniciarJogo);
inicioId.addEventListener('click', () => window.location.href = 'index.html');

// ===========================
// Teclas
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') jump();
    if (event.code === 'ArrowDown') {
        agachado = true;
        gabriel.src = 'img/Ramthun agachado.png';
        gabriel.style.width = '80px';
        gabriel.style.marginTop = '20px';
        gabriel.style.marginLeft = '20px';
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowDown') {
        agachado = false;
        gabriel.src = 'img/Gaybriel Ranthum.gif';
        gabriel.style.width = '140px';
        gabriel.style.marginTop = '0';
        gabriel.style.marginLeft = '0';
    }
});

// ===========================
// Dificuldade aumenta com o sol (ajusta durações e mantém alternância)
sol.addEventListener('animationiteration', () => {
    durMadeira = Math.max(0.5, durMadeira - 0.2);
    durPassaro = Math.max(0.5, durMadeira + 0.3); // pássaro um pouco mais lento

    madeira.style.animationDuration = `${durMadeira}s`;
    passaro.style.animationDuration = `${durPassaro}s`;
});

// ===========================
// Mudar de fase
function mudarDeFase() {
    fase++;
    if (faseEl) faseEl.textContent = `Fase: ${fase}`;
    window.location.href = 'animacaofinalfase1.html';
}
