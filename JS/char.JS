const db = {
    racas: {
        "Humano": { hp: 100, san: 100, for: 2, des: 1, rm: 1, rf: 1, nm: 5, rc: 3, passiva: "Versatilidade: Começa com NM e RC altos." },
        "Youkai": { hp: 150, san: 60, for: 4, des: 4, rm: 1, rf: 1, nm: 0, rc: 0, passiva: "Demon Sanity: Buffs quando sanidade está baixa." },
        "Morto-Vivo": { hp: 70, san: 51, for: 7, des: 0, rm: 2, rf: 2, nm: 0, rc: 0, passiva: "Imortalidade: Ganha status devorando corpos." }
    },
    classes: {
        "Guerreiro": ["Investida", "Bloqueio", "Fúria"],
        "Mago": ["Seta Arcana", "Escudo Mágico", "Meditação"],
        "Ladino": ["Furtividade", "Punhalada", "Veneno"]
    }
};

// Inicializar Seletores
function init() {
    const rSel = document.getElementById('charRace');
    const cSel = document.getElementById('charClass');
    
    Object.keys(db.racas).forEach(r => rSel.add(new Option(r, r)));
    Object.keys(db.classes).forEach(c => cSel.add(new Option(c, c)));

    rSel.addEventListener('change', carregarStatusBase);
    cSel.addEventListener('change', renderHabilidades);
    
    // Qualquer mudança nos inputs numéricos atualiza o texto final
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('change', atualizarTextoFinal);
    });

    carregarStatusBase();
}

function carregarStatusBase() {
    const raca = db.racas[document.getElementById('charRace').value];
    document.getElementById('hpMax').innerText = raca.hp;
    document.getElementById('hpAtual').value = raca.hp;
    document.getElementById('sanidade').innerText = raca.san;
    document.getElementById('stat_for').value = raca.for;
    document.getElementById('stat_des').value = raca.des;
    document.getElementById('stat_rm').value = raca.rm;
    document.getElementById('stat_rf').value = raca.rf;
    document.getElementById('stat_nm').value = raca.nm;
    document.getElementById('stat_rc').value = raca.rc;
    
    renderHabilidades();
}

function renderHabilidades() {
    const classe = document.getElementById('charClass').value;
    const container = document.getElementById('habilidades-opcoes');
    container.innerHTML = "";

    db.classes[classe].forEach(hab => {
        const div = document.createElement('div');
        div.innerHTML = `<input type="checkbox" class="hab-check" value="${hab}"> ${hab}`;
        div.querySelector('input').addEventListener('change', atualizarTextoFinal);
        container.appendChild(div);
    });
    atualizarTextoFinal();
}

function atualizarTextoFinal() {
    const racaNome = document.getElementById('charRace').value;
    const classeNome = document.getElementById('charClass').value;
    const nClasse = document.getElementById('classLevel').value;
    const selecionadas = Array.from(document.querySelectorAll('.hab-check:checked')).map(c => c.value);

    let resumo = `--- PASSIVAS (${racaNome}) ---\n${db.racas[racaNome].passiva}\n\n`;
    resumo += `--- HABILIDADES (${classeNome} Nív.${nClasse}) ---\n`;
    resumo += selecionadas.length ? selecionadas.join(' | ') : "Nenhuma selecionada.";
    
    document.getElementById('habilidades').value = resumo;
}

// Exportação/Importação mantêm a lógica anterior, mas agora salvam o ClassLevel
function exportarTxt() {
    const nome = document.getElementById('charName').value || "Ficha";
    let txt = `Nome: ${nome}\nRaça: ${document.getElementById('charRace').value}\n`;
    txt += `Classe: ${document.getElementById('charClass').value}\nNível Classe: ${document.getElementById('classLevel').value}\n`;
    txt += `FOR: ${document.getElementById('stat_for').value}\nDES: ${document.getElementById('stat_des').value}\n`;
    txt += `--- HABILIDADES ---\n${document.getElementById('habilidades').value}`;

    const blob = new Blob([txt], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome + ".txt";
    a.click();
}

window.onload = init;