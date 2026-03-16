const pessoa = document.querySelector('.pessoa1');
const dialogo = document.getElementById('dialogo');
const reiniciarId = document.getElementById('reiniciar');
const inicioId = document.getElementById('inicio');
const startBtn = document.getElementById('start-btn');
const introScreen = document.getElementById('intro-screen');
const espaco = document.getElementById('clicarEspaco');

let posicao = 0;
let jogoAtivo = false;
let passo = 10;


// Botão Start
startBtn.addEventListener('click', () => {
    introScreen.style.display = 'none';
    iniciarJogo();
});


function iniciarJogo() {
    jogoAtivo = true;
    posicao = 0;
    pessoa.style.left = posicao + "px";
    reiniciarId.style.visibility = 'hidden';
    inicioId.style.visibility = 'hidden';
    dialogo.style.display = 'none';
}


function ClicarEspaco() {
    espaco.style.display = 'block';
    jogoAtivo = false;
}
// Botão "Próximo"
function proximaFase() {
    const fadeScreen = document.getElementById('fade-screen');
    fadeScreen.classList.add('active'); // ativa a tela preta
    
    setTimeout(() => {
        window.location.href = "animacaofinalfase2.html";
    }, 800);
}



// Botões Reiniciar e Início
reiniciarId.addEventListener('click', iniciarJogo);
inicioId.addEventListener('click', () => { window.location.href = 'index.html'; });


// Movimento com setas
document.addEventListener("keydown", (e) => {
    if (!jogoAtivo) return;

    if (e.code === "ArrowRight") {
        posicao += passo;
        pessoa.style.left = posicao + "px";
    } 
    else if (e.code === "ArrowLeft") {
        posicao -= passo;
        if (posicao < 0) posicao = 0;
        pessoa.style.left = posicao + "px";
    }

    // Checar limite de 28% da tela
    const limite = window.innerWidth * 0.750;
    if (posicao >= limite) {
        ClicarEspaco();
    }
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Enter') {
          console.log('Espaço foi pressionado!');
          proximaFase()
        }
      });
      
   
});

// Tecla espaço para pular
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && jogoAtivo) {
        pessoa.classList.add("jump");
        setTimeout(() => pessoa.classList.remove("jump"), 500);
    }
});
