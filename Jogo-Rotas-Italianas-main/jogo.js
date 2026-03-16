const pessoa = document.querySelector('.pessoa1');
const tijolo = document.querySelector('.tijolo');
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
let jogoAtivo = false; // começa desativado
let loopColisao;
let loopPontos;
let fase = 1;
const pontosPorFase = 16;

// ===========================
// Botão Start
startBtn.addEventListener('click', () => {
    introScreen.style.display = 'none'; // esconde tela de introdução
    iniciarJogo();
});

// ===========================
// Função de pulo
const jump = () => {
    if (!jogoAtivo) return;
    pessoa.classList.add('jump');
    setTimeout(() => pessoa.classList.remove('jump'), 500);
};

// ===========================
// Loop de colisão
function startLoop() {
    loopColisao = setInterval(() => {
        if (!jogoAtivo) return;

        const tijoloPosition = +getComputedStyle(tijolo).left.replace('px', '');
        const pessoaPosition = +getComputedStyle(pessoa).bottom.replace('px', '');

        if (tijoloPosition <= 118 && tijoloPosition > 0 && pessoaPosition < 70) {
            // Colisão
            mortes++;
            morteEl.textContent = `Mortes: ${mortes}`;
            jogoAtivo = false;

            // Congelar posições
            sol.style.animationPlayState = 'paused';
            tijolo.style.animationPlayState = 'paused';
            pessoa.style.animationPlayState = 'paused';

            const pessoaBottom = parseFloat(getComputedStyle(pessoa).bottom);
            pessoa.style.animation = 'none';
            pessoa.style.bottom = `${pessoaBottom}px`;

            // Visual de "morte"
            sol.src = './img/Lua.png';
            sol.style.width = '190px';
            background.style.background = 'linear-gradient(#060057, #0051ffa6)';

            pessoa.src = './img/pessoa-triste.png';
            pessoa.style.width = '90px';
            pessoa.style.marginLeft = '25px';
            pessoa.style.marginBottom = `${pessoaPosition}`;

            clearInterval(loopColisao);
            clearInterval(loopPontos);

            reiniciarId.style.visibility = 'visible';
            inicioId.style.visibility = 'visible';
        }
    }, 5);
}

// ===========================
// Reiniciar/Iniciar Jogo
function iniciarJogo() {
    jogoAtivo = true;
    reiniciarId.style.visibility = 'hidden';
    inicioId.style.visibility = 'hidden';
    pontos = 0;
    pontoEl.textContent = `Pontos: ${pontos}`;

    // Resetar posições
    tijolo.style.left = '';
    tijolo.style.right = '';
    sol.style.left = '';
    sol.style.right = '';
    pessoa.style.bottom = '';

    // Resetar animações
    tijolo.style.animation = 'none';
    sol.style.animation = 'none';
    void tijolo.offsetWidth; // reflow
    void sol.offsetWidth;

    pessoa.style.animation = '';

    tijolo.style.animation = 'tijolo-animation 1.5s linear infinite';
    sol.style.animation = 'sol-animation 20s linear infinite';

    // Restaurar sprites
    sol.src = './img/sol.png';
    sol.style.width = '240px';
    background.style.background = 'linear-gradient(#ffae00, #fbff00)';

    pessoa.src = './img/pessoa-correndo.gif';
    pessoa.style.width = '140px';
    pessoa.style.marginLeft = '0';
    pessoa.style.marginBottom = '0';

    // Ativar animações
    tijolo.style.animationPlayState = 'running';
    sol.style.animationPlayState = 'running';
    pessoa.style.animationPlayState = 'running';

    // Loop de colisão e pontos
    startLoop();
    loopPontos = setInterval(() => {
        if (jogoAtivo) {
            pontos++;
            pontoEl.textContent = `Pontos: ${pontos}`;
            if (pontos % pontosPorFase === 0) {
                mudarDeFase();
            }
        }
    }, 1000);
}

// ===========================
// Botões Reiniciar e Início
reiniciarId.addEventListener('click', iniciarJogo);
inicioId.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// ===========================
// Tecla espaço para pular
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') jump();
});

// ===========================
// Dificuldade aumenta com o sol
sol.addEventListener('animationiteration', () => {
    const currentDuration = parseFloat(getComputedStyle(tijolo).animationDuration);
    const newDuration = Math.max(0.5, currentDuration - 0.2);
    tijolo.style.animationDuration = `${newDuration}s`;
});

// Mudar de fase
function mudarDeFase() {
    fase++;
    // Atualiza visual da fase
    if (faseEl) faseEl.textContent = `Fase: ${fase}`;
    // Pode direcionar para outra página ou modificar o jogo aqui
    window.location.href = 'fase2.html'; // Exemplo de mudança de página
}
