window.onload = () => {
    const dialogo = document.querySelector('.dialogo');
    const buttonDialogo = document.querySelector('#finalizarBtn');
    
    // Exibir o diálogo automaticamente ao carregar a página
    dialogo.style.display = 'block';

    // Redirecionar para a tela de créditos ao clicar em "Finalizar"
    buttonDialogo.addEventListener('click', () => {
        window.location.href = 'creditos.html';  // Altere para o caminho correto da sua página de créditos
    });

    // Fechar a caixa de diálogo ao pressionar a tecla 'Escape'
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            dialogo.style.display = 'none';
        }
    });
};
