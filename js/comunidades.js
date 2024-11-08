/**
 * @fileoverview Este arquivo contém funções para carregar e exibir a lista de comunidades.
 * @author Fabio
 * @version 1.2.0
 */

/**
 * Carrega os dados das comunidades e preenche a página com cards para cada comunidade.
 * @function
 * @async
 */
async function carregarComunidades() {
    try {
        const response = await fetch('../data/comunidades.json');
        const comunidades = await response.json();

        // Carrega comunidades no select do modal de doação
        const selectComunidade = document.getElementById('comunidade');
        if (selectComunidade) {
            selectComunidade.innerHTML = '<option value="">Selecione uma comunidade</option>';
            comunidades.forEach(comunidade => {
                selectComunidade.innerHTML += `
                    <option value="${comunidade.nome}">${comunidade.nome}</option>
                `;
            });
        }

        // Carrega comunidades na página de comunidades (se existir)
        const comunidadesContainer = document.getElementById('comunidades-container');
        if (comunidadesContainer) {
            comunidadesContainer.innerHTML = '';
            comunidades.forEach(comunidade => {
                const imagemPath = comunidade.imagem || '../img/comunidade-default.jpg';
                const comunidadeElement = document.createElement('div');
                comunidadeElement.classList.add('col-md-4', 'mb-4');
                comunidadeElement.innerHTML = `
                    <div class="card h-100">
                        <div class="card-img-top-wrapper" style="height: 200px; overflow: hidden;">
                            <img src="${imagemPath}" 
                                 class="card-img-top" 
                                 alt="${comunidade.nome}" 
                                 style="object-fit: cover; height: 100%; width: 100%;"
                                 onerror="this.src='../img/comunidade-default.jpg'">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${comunidade.nome}</h5>
                            <p class="card-text">${comunidade.descricao}</p>
                            <p class="card-text">
                                <small class="text-muted fs-6">
                                    <i class="fas fa-user me-2"></i>${comunidade.numDoadores || '25'} Doadores
                                    <i class="fas fa-gift ms-3 me-2"></i>${comunidade.numDoacoes || '150'} Doações
                                </small>
                            </p>
                            <a href="perfil_comunidade.html?id=${comunidade.id}" class="btn btn-primary mt-auto">Ver mais</a>
                        </div>
                    </div>
                `;
                comunidadesContainer.appendChild(comunidadeElement);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar dados das comunidades:', error);
        alert('Ocorreu um erro ao carregar os dados das comunidades. Por favor, tente novamente mais tarde.');
    }
}

// Exporta a função para uso global
window.carregarComunidades = carregarComunidades;

// Carrega as comunidades quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', carregarComunidades);

const COMUNIDADES = [
    {
        id: 1,
        nome: "Comunidade São João",
        descricao: "Comunidade localizada na zona norte",
        endereco: "Rua São João, 123",
        telefone: "(11) 1234-5678",
        email: "saojoao@email.com"
    },
    {
        id: 2,
        nome: "Comunidade Santa Maria",
        descricao: "Comunidade localizada na zona sul",
        endereco: "Rua Santa Maria, 456",
        telefone: "(11) 8765-4321",
        email: "santamaria@email.com"
    },
    {
        id: 3,
        nome: "Comunidade Santo Antônio",
        descricao: "Comunidade localizada na zona leste",
        endereco: "Rua Santo Antônio, 789",
        telefone: "(11) 2468-1357",
        email: "santoantonio@email.com"
    }
];