/**
 * @fileoverview Este arquivo contém funções para carregar e exibir dados do perfil de uma comunidade.
 * @author Fabio
 * @version 1.5.0
 */

/**
 * Carrega os dados da comunidade e preenche os elementos HTML correspondentes.
 * @function
 * @async
 */
async function carregarDadosComunidade() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const comunidadeId = urlParams.get('id');
        
        const response = await fetch('../data/comunidades.json');
        const comunidades = await response.json();
        const comunidade = comunidades.find(c => c.id === parseInt(comunidadeId));
        
        if (!comunidade) {
            throw new Error('Comunidade não encontrada');
        }

        // Carrega os dados básicos da comunidade
        document.getElementById('comunidade-nome').textContent = comunidade.nome;
        document.getElementById('comunidade-imagem').src = comunidade.imagem || '../img/comunidade-default.jpg';
        document.getElementById('comunidade-descricao').textContent = comunidade.descricao;
        
        // Carrega as atividades da comunidade
        const atividadesComunidade = JSON.parse(localStorage.getItem('atividades_comunidades') || '{}');
        const atividadesDaComunidade = atividadesComunidade[comunidade.nome] || [];
        
        console.log('Atividades encontradas:', atividadesDaComunidade); // Debug
        
        carregarAtividades(atividadesDaComunidade, comunidade);
    } catch (error) {
        console.error('Erro ao carregar dados da comunidade:', error);
    }
}

/**
 * Carrega e exibe as conquistas da comunidade.
 * @function
 * @param {Array} conquistas - Array de objetos representando as conquistas.
 */
function carregarConquistas(conquistas) {
    const conquistasContainer = document.getElementById('conquistas-container');
    if (!conquistasContainer) return;

    conquistasContainer.innerHTML = '';
    conquistas.forEach(conquista => {
        const conquistaElement = document.createElement('div');
        conquistaElement.classList.add('mb-2');
        conquistaElement.innerHTML = `
            <i class="fas fa-trophy text-primary me-2"></i>
            <span class="text-muted" style="font-size: 0.9rem;">
                <strong>${conquista.titulo}</strong>: ${conquista.descricao}
            </span>
        `;
        conquistasContainer.appendChild(conquistaElement);
    });
}

/**
 * Carrega e exibe as atividades da comunidade.
 * @function
 * @param {Array} atividades - Array de objetos representando as atividades.
 * @param {Object} comunidade - Dados da comunidade
 */
function carregarAtividades(atividades, comunidade) {
    console.log('Carregando atividades:', atividades); // Debug
    
    const atividadesContainer = document.getElementById('atividades-container');
    if (!atividadesContainer) return;

    atividadesContainer.innerHTML = '';
    
    if (!atividades || atividades.length === 0) {
        atividadesContainer.innerHTML = `
            <div class="alert alert-info">
                Nenhuma atividade registrada ainda.
            </div>
        `;
        return;
    }

    atividades.forEach(atividade => {
        console.log('Processando atividade:', atividade); // Debug
        
        const atividadeElement = document.createElement('div');
        atividadeElement.classList.add('card', 'mb-3');
        
        // Verifica a imagem tanto na atividade quanto na doação
        const imagemAtividade = atividade.imagem || (atividade.doacao ? atividade.doacao.imagem : null);
        
        atividadeElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <img src="${comunidade.imagem || '../img/comunidade-default.jpg'}" 
                         alt="Avatar ${comunidade.nome}" 
                         class="rounded-circle me-3" 
                         width="50" height="50" 
                         style="object-fit: cover;">
                    <div>
                        <h5 class="card-title mb-0">${comunidade.nome}</h5>
                        <small class="text-muted">${new Date(atividade.tempo).toLocaleDateString()}</small>
                    </div>
                </div>
                <p class="card-text">${atividade.mensagem}</p>
                ${imagemAtividade ? `
                    <div class="mt-3">
                        <img src="${imagemAtividade}" 
                             alt="Imagem da doação" 
                             class="img-fluid rounded" 
                             style="max-height: 300px; width: auto;"
                             onerror="this.src='../img/placeholder-image.png'">
                    </div>
                ` : ''}
            </div>
        `;
        
        atividadesContainer.appendChild(atividadeElement);
    });
}

/**
 * Formata o tempo relativo (ex: "há 2 dias")
 * @param {Date} data - Data a ser formatada
 * @returns {string} Tempo formatado
 */
function formatarTempo(data) {
    const agora = new Date();
    const diff = agora - data;
    const segundos = Math.floor(diff / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Agora mesmo';
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', carregarDadosComunidade);