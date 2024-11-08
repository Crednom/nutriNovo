// Sistema de eventos personalizado
const EventSystem = {
    events: {},
    subscribe: function(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },
    publish: function(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
};

// Gerenciador de Doações
class DoacoesManager {
    constructor() {
        this.doacoes = [];
        this.filtros = {
            texto: '',
            tipo: '',
            comunidade: ''
        };

        // Elementos do DOM
        this.searchInput = document.getElementById('searchDoacoes');
        this.tipoSelect = document.getElementById('tipoAlimentoFiltro');
        this.comunidadeSelect = document.getElementById('comunidadeFiltro');
        this.doacoesContainer = document.getElementById('doacoes-container');
        this.btnLimpar = document.getElementById('btnLimparDoacoes');

        // Inicialização
        this.initializeEventListeners();
        this.loadDoacoes();
        this.carregarComunidades();
    }

    async carregarComunidades() {
        try {
            const response = await fetch('../data/comunidades.json');
            const comunidades = await response.json();
            
            if (this.comunidadeSelect) {
                // Limpa as opções existentes, mantendo apenas a opção padrão
                this.comunidadeSelect.innerHTML = '<option value="">Todas as comunidades</option>';
                
                // Adiciona as comunidades
                comunidades.forEach(comunidade => {
                    const option = document.createElement('option');
                    option.value = comunidade.nome;
                    option.textContent = comunidade.nome;
                    this.comunidadeSelect.appendChild(option);
                });
                
                console.log('Comunidades carregadas com sucesso');
            }
        } catch (error) {
            console.error('Erro ao carregar comunidades:', error);
        }
    }

    initializeEventListeners() {
        // Evento do botão limpar
        const btnLimpar = document.getElementById('btnLimparDoacoes');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => this.limparTodasDoacoes());
        }

        // Eventos de filtro existentes
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                this.filtros.texto = this.searchInput.value.toLowerCase();
                this.aplicarFiltros();
            });
        }

        if (this.tipoSelect) {
            this.tipoSelect.addEventListener('change', () => {
                this.filtros.tipo = this.tipoSelect.value;
                this.aplicarFiltros();
            });
        }

        if (this.comunidadeSelect) {
            this.comunidadeSelect.addEventListener('change', () => {
                this.filtros.comunidade = this.comunidadeSelect.value;
                this.aplicarFiltros();
            });
        }
    }

    loadDoacoes() {
        try {
            const doacoesString = localStorage.getItem('doacoes');
            this.doacoes = doacoesString ? JSON.parse(doacoesString) : [];
            this.aplicarFiltros();
        } catch (error) {
            console.error('Erro ao carregar doações:', error);
            this.doacoes = [];
        }
    }

    aplicarFiltros() {
        let doacoesFiltradas = [...this.doacoes];

        // Filtro de texto
        if (this.filtros.texto) {
            doacoesFiltradas = doacoesFiltradas.filter(doacao => 
                doacao.nomeAlimento.toLowerCase().includes(this.filtros.texto) ||
                doacao.comunidade.toLowerCase().includes(this.filtros.texto)
            );
        }

        // Filtro de tipo
        if (this.filtros.tipo) {
            doacoesFiltradas = doacoesFiltradas.filter(doacao => 
                doacao.tipoAlimento === this.filtros.tipo
            );
        }

        // Filtro de comunidade
        if (this.filtros.comunidade) {
            doacoesFiltradas = doacoesFiltradas.filter(doacao => 
                doacao.comunidade === this.filtros.comunidade
            );
        }

        this.renderDoacoes(doacoesFiltradas);
    }

    renderDoacoes(doacoes) {
        if (!this.doacoesContainer) return;

        this.doacoesContainer.innerHTML = '';
        
        if (doacoes.length === 0) {
            this.doacoesContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">Nenhuma doação encontrada</p>
                </div>
            `;
            return;
        }

        doacoes.forEach(doacao => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'col';
            cardDiv.innerHTML = `
                <div class="card h-100" style="max-width: 350px;">
                    <img src="${doacao.imagem || '../img/sem-imagem.png'}" 
                         class="card-img-top" 
                         alt="${doacao.nomeAlimento}"
                         style="height: 200px; object-fit: cover;"
                         onerror="this.src='../img/sem-imagem.png'">
                    <div class="card-body">
                        <h5 class="card-title">${doacao.nomeAlimento}</h5>
                        <p class="card-text">
                            <small class="text-muted">
                                Quantidade: ${doacao.quantidade} ${doacao.unidadeMedida}<br>
                                Tipo: ${this.formatarTipoAlimento(doacao.tipoAlimento)}<br>
                                Data de validade: ${new Date(doacao.dataValidade).toLocaleDateString()}<br>
                                Comunidade: ${doacao.comunidade}
                            </small>
                        </p>
                        <button onclick="doacoesManager.mostrarInteresse(${doacao.id})" 
                                class="btn btn-primary">
                            Tenho interesse
                        </button>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">
                            Doado por ${doacao.nomeDoador} em ${new Date(doacao.dataCriacao).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            `;
            this.doacoesContainer.appendChild(cardDiv);
        });
    }

    formatarTipoAlimento(tipo) {
        const tipos = {
            'perecivel': 'Perecível',
            'naoPerecivel': 'Não Perecível',
            'hortifruti': 'Hortifruti',
            'graos': 'Grãos',
            'proteinas': 'Proteínas',
            'laticinios': 'Laticínios',
            'industrializados': 'Industrializados',
            'bebidas': 'Bebidas',
            'outros': 'Outros'
        };
        return tipos[tipo] || tipo;
    }

    mostrarInteresse(doacaoId) {
        alert('Interesse registrado! Em breve entraremos em contato.');
    }

    limparTodasDoacoes() {
        if (confirm('Tem certeza que deseja limpar todas as doações? Esta ação não pode ser desfeita.')) {
            try {
                // Limpa as doações
                localStorage.setItem('doacoes', '[]');
                
                // Limpa as atividades relacionadas a doações
                const atividadesComunidade = JSON.parse(localStorage.getItem('atividades_comunidades') || '{}');
                for (let comunidade in atividadesComunidade) {
                    atividadesComunidade[comunidade] = atividadesComunidade[comunidade].filter(
                        atividade => atividade.tipo !== 'doacao'
                    );
                }
                localStorage.setItem('atividades_comunidades', JSON.stringify(atividadesComunidade));

                // Recarrega os dados
                this.doacoes = [];
                this.renderDoacoes([]);
                
                alert('Todas as doações foram removidas com sucesso!');
            } catch (error) {
                console.error('Erro ao limpar doações:', error);
                alert('Erro ao limpar as doações. Por favor, tente novamente.');
            }
        }
    }
}

// Inicialização quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Cria a instância global do gerenciador de doações
    window.doacoesManager = new DoacoesManager();
});