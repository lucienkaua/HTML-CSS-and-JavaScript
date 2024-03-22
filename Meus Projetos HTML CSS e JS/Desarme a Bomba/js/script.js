const minutos = document.querySelector('#minutos');
const segundos = document.querySelector('#segundos');
const milisegundos = document.querySelector('#milisegundos');
const botComecar = document.querySelector('#botComecar');
const botPausar = document.querySelector('#botPausar');
const botContinuar = document.querySelector('#botContinuar');
const botResetar = document.querySelector('#botResetar');
const botCadastrar = document.querySelector('#botCadastrar');
const botChecar = document.querySelector('#botChecar');

let nomeGrupo = document.querySelector('#nomeGrupo');
let turma = document.querySelector('#turma');
let intervalo;
let min = 0;
let seg = 0;
let miliSeg = 0;
let pausado = false;
let record = '';
let jogoPerdido = false;
cont = 0

let grupos = [];

botComecar.addEventListener("click", comecarTimer);
botPausar.addEventListener("click", pausarTimer);
botContinuar.addEventListener("click", continuarTimer);
botResetar.addEventListener("click", resetarTimer);
botCadastrar.addEventListener("click", function(e) {
    e.preventDefault();
    cadastrarPontos();
});
botChecar.addEventListener("click", checarSenha);

function redirecionaBomba() {
    window.location.href = 'index.html';
}

function comecarTimer() {
    intervalo = setInterval(() => {
        if (!pausado && !jogoPerdido) {
            miliSeg += 10;

            if (miliSeg === 1000) {
                seg++;
                miliSeg = 0;
                cont ++;
                    if (cont >= 4) {
                    }
            }

            if (seg === 60) {
                min++;
                seg = 0;
            }

            minutos.textContent = formatarTempo(min);
            segundos.textContent = formatarTempo(seg);
            milisegundos.textContent = formataMiliseg(miliSeg);

            if (min === 20) {
                jogoPerdido = true;
                exibirMensagemPerdeu();
                desativarBotoes();
            }
        }
    }, 10)

    botComecar.style.display = "none";
    botPausar.style.display = "block";
}

function exibirMensagemPerdeu() {
    alert("A bomba explodiu!!!");
}

function desativarBotoes() {
    botPausar.style.display = "none";
    botContinuar.style.display = "none";
    botResetar.style.display = "none";
    botChecar.style.display = "none";
    botCadastrar.style.display = "none";
}

function pausarTimer() {
    pausado = true;
    botPausar.style.display = "none";
    botContinuar.style.display = "block";
}

function continuarTimer() {
    pausado = false;
    botPausar.style.display = "block";
    botContinuar.style.display = "none";
}

function resetarTimer() {
    pausado = false;
    clearInterval(intervalo);
    min = 0;
    seg = 0;
    miliSeg = 0;

    minutos.textContent = "00";
    segundos.textContent = "00";
    milisegundos.textContent = "000";

    botComecar.style.display = "block";
    botPausar.style.display = "none";
    botContinuar.style.display = "none";
}

function checarSenha() {
    const digito1 = document.getElementById('digito1').value;
    const digito2 = document.getElementById('digito2').value;
    const digito3 = document.getElementById('digito3').value;
    const digito4 = document.getElementById('digito4').value;

    const senha = [digito1, digito2, digito3, digito4];

    if (validarSenha(senha)) {
        tocar("sounds/bombDefuse.mp3");
        alert('Senha correta!' + `Recorde atual: ${min}:${seg}:${miliSeg}`);
        desativarBotoes();
        titulo = document.getElementById("tituloPrincipal");
        titulo.innerHTML = "Você desarmou a bomba!";
    } else {
        alert('Senha incorreta!');
        limparCampos();
    }
}

function validarSenha(senha) {
    const digitosCorretos = [4, 9, 8, 4];
    let senhaCorreta = true;

    for (let i = 0; i < senha.length; i++) {
        const digitoNumerico = parseInt(senha[i]);

        if (isNaN(digitoNumerico) || digitoNumerico !== digitosCorretos[i]) {
            senhaCorreta = false;
            break;
        }
    }

    if (senhaCorreta) {
        botCadastrar.style.display = 'block';
        pausarTimer();
    } else {
        alert('Senha incorreta! Tente novamente...');
    }
    return senhaCorreta;
}

function limparCampos() {
    document.getElementById('digito1').value = '';
    document.getElementById('digito2').value = '';
    document.getElementById('digito3').value = '';
    document.getElementById('digito4').value = '';
}

function cadastrarPontos() {
    const recordeAtual = `${min}:${seg}:${miliSeg}`;
    const nomeGrupo = document.getElementById('nomeGrupo').value;
    const nomeTurma = document.getElementById('turma').value;

    const novoGrupo = {
        Recorde: recordeAtual,
        'Nome do Grupo': nomeGrupo,
        'Nome da Turma': nomeTurma,
    };
    grupos.push(novoGrupo);
    exibirGruposNaTabela();
    window.location.href = 'ranking.html';
}

function exibirGruposNaTabela() {
    const tabela = document.getElementById('tabelaRanking');
    const tbody = tabela.querySelector('tbody');

    tbody.innerHTML = '';

    grupos.forEach((grupo, index) => {
        const tr = document.createElement('tr');

        Object.values(grupo).forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function formatarTempo(tempo) {
    return tempo < 10 ? `0${tempo}` : tempo;
}

function formataMiliseg(tempo) {
    return tempo < 100 ? `${tempo}`.padStart(3, "0") : tempo;
}

function tocar(caminho) {
    var audio = new Audio();
    audio.src = caminho;
    audio.play();
}