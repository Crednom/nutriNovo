function initializeModalEvents() {
    console.log('Inicializando eventos do modal...');

    // Carregar comunidades
    async function carregarComunidades() {
        try {
            const response = await fetch('../data/comunidades.json');
            const comunidades = await response.json();
            const selectComunidade = document.getElementById('comunidade');
            
            if (selectComunidade) {
                selectComunidade.innerHTML = '<option value="">Selecione uma comunidade</option>';
                comunidades.forEach(comunidade => {
                    const option = document.createElement('option');
                    option.value = comunidade.nome;
                    option.textContent = comunidade.nome;
                    selectComunidade.appendChild(option);
                });
                console.log('Comunidades carregadas no modal com sucesso');
            }
        } catch (error) {
            console.error('Erro ao carregar comunidades no modal:', error);
        }
    }

    // Chamar carregamento de comunidades
    carregarComunidades();

    // Elementos do DOM
    const formDoacao = document.getElementById('formDoacao');
    const inputImagem = document.getElementById('imagemAlimento');
    const previewImagem = document.getElementById('previewImagem');
    const nomeAlimento = document.getElementById('nomeAlimento');

    // Garantir que o input de nome do alimento esteja habilitado
    if (nomeAlimento) {
        nomeAlimento.removeAttribute('disabled');
        nomeAlimento.addEventListener('input', function(e) {
            console.log('Input nome alimento:', e.target.value);
        });
    }

    // Preview da imagem
    if (inputImagem && previewImagem) {
        console.log('Configurando preview de imagem');
        inputImagem.addEventListener('change', function(e) {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImagem.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Processar o formulário
    if (formDoacao && !formDoacao.hasAttribute('data-initialized')) {
        console.log('Configurando evento de submit do formulário');
        formDoacao.setAttribute('data-initialized', 'true');
        
        formDoacao.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulário submetido');

            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }

            try {
                const dadosDoacao = {
                    nomeAlimento: document.getElementById('nomeAlimento').value,
                    tipoAlimento: document.getElementById('tipoAlimento').value,
                    dataValidade: document.getElementById('dataValidade').value,
                    dataDoacao: document.getElementById('dataDoacao').value,
                    localRetirada: document.getElementById('localRetirada').value,
                    quantidade: document.getElementById('quantidade').value,
                    unidadeMedida: document.getElementById('unidadeMedida').value,
                    comunidade: document.getElementById('comunidade').value,
                    nomeDoador: document.getElementById('nomeDoador').value,
                    imagem: previewImagem.src,
                    id: Date.now(),
                    status: 'disponível',
                    dataCriacao: new Date().toISOString()
                };

                console.log('Dados coletados:', dadosDoacao);

                // Salvar doação
                const doacoes = JSON.parse(localStorage.getItem('doacoes') || '[]');
                doacoes.push(dadosDoacao);
                localStorage.setItem('doacoes', JSON.stringify(doacoes));

                // Salvar atividade
                const atividades = JSON.parse(localStorage.getItem('atividades_comunidades') || '{}');
                if (!atividades[dadosDoacao.comunidade]) {
                    atividades[dadosDoacao.comunidade] = [];
                }

                atividades[dadosDoacao.comunidade].unshift({
                    id: Date.now(),
                    tipo: 'doacao',
                    tempo: new Date().toISOString(),
                    mensagem: `Nova doação: ${dadosDoacao.quantidade} ${dadosDoacao.unidadeMedida} de ${dadosDoacao.nomeAlimento}`,
                    imagem: dadosDoacao.imagem
                });

                localStorage.setItem('atividades_comunidades', JSON.stringify(atividades));

                // Limpar formulário e fechar modal
                this.reset();
                previewImagem.src = '../img/placeholder-image.png';
                this.classList.remove('was-validated');

                const modal = bootstrap.Modal.getInstance(document.getElementById('doacaoModal'));
                if (modal) {
                    modal.hide();
                }

                // Atualizar lista de doações
                if (window.doacoesManager) {
                    window.doacoesManager.loadDoacoes();
                }

                alert('Doação registrada com sucesso!');

            } catch (error) {
                console.error('Erro ao processar doação:', error);
                alert('Erro ao processar a doação: ' + error.message);
            }
        });
    }
}

// Inicializar quando o modal for aberto
document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'doacaoModal') {
        console.log('Modal aberto, inicializando eventos...');
        initializeModalEvents();
    }
});

// Limpar flag de inicialização quando o modal for fechado
document.addEventListener('hidden.bs.modal', function(event) {
    if (event.target.id === 'doacaoModal') {
        const form = document.getElementById('formDoacao');
        if (form) {
            form.removeAttribute('data-initialized');
        }
    }
});