    // Configurações do Sistema
    const TABELA_XP = { 'D': 10, 'C': 45, 'B': 80, 'A': 125, 'S': 180, 'SS': 225 };
    const MULT_GRUPO = { 1: 1, 2: 1.3, 3: 1.5, 4: 1.75 };

    // Estado do Personagem
    let personagem = {
        nome: "Aventureiro",
        nivel: 0,
        xp: 0
    };

    function getThreshold(n) {
        return Math.pow(n, 2) * 25;
    }

function calcularSessao() {
    personagem.nome = document.getElementById('charName').value;
    // Pega o input e remove espaços extras
    const inimigosInput = document.getElementById('inimigosRanks').value.toUpperCase().trim();
    const dungeonRank = document.getElementById('dungeonRank').value;
    const qtdGrupo = parseInt(document.getElementById('qtdGrupo').value);
    const pedras = Math.min(parseInt(document.getElementById('pedrasMagicas').value) || 0, 5);

    let ganhoBase = 0;

    if (inimigosInput !== "") {
        // 1. Separa os grupos pelo sinal de "+"
        // Ex: "5, D + 2, C" vira ["5, D", "2, C"]
        const grupos = inimigosInput.split('+');

        grupos.forEach(grupo => {
            // 2. Separa a quantidade do Rank pela vírgula
            // Ex: "5, D" vira ["5", "D"]
            const partes = grupo.split(',');
            
            if (partes.length === 2) {
                const qtd = parseInt(partes[0].trim());
                const rank = partes[1].trim();
                
                if (!isNaN(qtd) && TABELA_XP[rank]) {
                    ganhoBase += TABELA_XP[rank] * qtd;
                }
            } else {
                // Caso o usuário digite apenas o Rank (ex: "S") sem a vírgula
                const rank = partes[0].trim();
                if (TABELA_XP[rank]) ganhoBase += TABELA_XP[rank];
            }
        });
    }
    // ------------------------------------------------

    // 2. Dungeon
    if (dungeonRank) ganhoBase += TABELA_XP[dungeonRank];

    // 3. Multiplicador de Grupo
    let xpFinal = ganhoBase * MULT_GRUPO[qtdGrupo];

    // 4. Pedras Mágicas (n² * 5 por pedra)
    let xpPorPedra = Math.pow(personagem.nivel + 1, 2) * 5;
    xpFinal += (xpPorPedra * pedras);

    // Atualização de XP e Level Up
    personagem.xp += Math.floor(xpFinal);
    
    while (personagem.xp >= getThreshold(personagem.nivel + 1)) {
        personagem.nivel++;
    }

    atualizarInterface();
    document.getElementById('log').innerText = `Ganho total nesta sessão: +${Math.floor(xpFinal)} XP!`;
}

    function atualizarInterface() {
        const prox = getThreshold(personagem.nivel + 1);
        document.getElementById('displayNivel').innerText = personagem.nivel;
        document.getElementById('displayXP').innerText = personagem.xp;
        document.getElementById('displayFalta').innerText = Math.max(0, prox - personagem.xp);
    }

    function exportarDados() {
        const falta = getThreshold(personagem.nivel + 1) - personagem.xp;
        const texto = `=== FICHA DE PROGRESSO ===\r\n` +
                      `Nome: ${personagem.nome}\r\n` +
                      `Nível Atual: ${personagem.nivel}\r\n` +
                      `XP Acumulada: ${personagem.xp}\r\n` +
                      `Falta para o Próximo Nível: ${falta}\r\n` +
                      `==========================`;
        
        const blob = new Blob([texto], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `progresso_${personagem.nome}.txt`;
        link.click();
    }