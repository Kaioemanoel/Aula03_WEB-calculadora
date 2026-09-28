const disciplinasContainer =
    document.getElementById("disciplinas");

const btnAdicionar =
    document.getElementById("adicionarDisciplina");

const btnCalcular =
    document.getElementById("calcular");

const btnLimpar =
    document.getElementById("limpar");


let contador = 0;


/* =====================================
   CRIAR DISCIPLINA
===================================== */

function adicionarDisciplina(
    nome = "",
    notas = ["", "", "", ""]
) {

    contador++;

    const div = document.createElement("div");

    div.className = "disciplina";

    div.dataset.id = contador;

    div.innerHTML = `

        <div class="disciplina-topo">

            <div class="disciplina-numero">

                <div class="numero">
                    ${contador}
                </div>

                <input
                    type="text"
                    class="nome-disciplina"
                    placeholder="Nome da disciplina"
                    value="${nome}"
                >

            </div>

            <button
                class="btn-remover"
                title="Remover disciplina"
            >
                ×
            </button>

        </div>


        <div class="notas">

            <div class="nota">

                <label>1ª Nota</label>

                <input
                    type="number"
                    class="nota-input"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="0,0"
                    value="${notas[0]}"
                >

            </div>


            <div class="nota">

                <label>2ª Nota</label>

                <input
                    type="number"
                    class="nota-input"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="0,0"
                    value="${notas[1]}"
                >

            </div>


            <div class="nota">

                <label>3ª Nota</label>

                <input
                    type="number"
                    class="nota-input"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="0,0"
                    value="${notas[2]}"
                >

            </div>


            <div class="nota">

                <label>4ª Nota</label>

                <input
                    type="number"
                    class="nota-input"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="0,0"
                    value="${notas[3]}"
                >

            </div>

        </div>

    `;


    div
        .querySelector(".btn-remover")
        .addEventListener("click", () => {

            div.remove();

            atualizarNumeracao();

            salvarDados();

        });


    disciplinasContainer.appendChild(div);

    atualizarNumeracao();

    salvarDados();
}


/* =====================================
   NUMERAÇÃO
===================================== */

function atualizarNumeracao() {

    const disciplinas =
        document.querySelectorAll(".disciplina");

    disciplinas.forEach((disciplina, index) => {

        disciplina
            .querySelector(".numero")
            .textContent = index + 1;

    });

    contador = disciplinas.length;
}


/* =====================================
   PEGAR PESOS
===================================== */

function obterPesos() {

    return [
        Number(document.querySelectorAll(".peso-input")[0].value) || 0,
        Number(document.querySelectorAll(".peso-input")[1].value) || 0,
        Number(document.querySelectorAll(".peso-input")[2].value) || 0,
        Number(document.querySelectorAll(".peso-input")[3].value) || 0
    ];

}


/* =====================================
   CALCULAR MÉDIA
===================================== */

function calcularMedia(notas, pesos) {

    let soma = 0;

    let somaPesos = 0;


    for (let i = 0; i < 4; i++) {

        soma += notas[i] * pesos[i];

        somaPesos += pesos[i];

    }


    if (somaPesos === 0) {

        return 0;

    }


    return soma / somaPesos;
}


/* =====================================
   SITUAÇÃO
===================================== */

function obterSituacao(media) {

    if (media >= 7) {

        return {
            texto: "Aprovado",
            classe: "aprovado"
        };

    }


    if (media >= 5) {

        return {
            texto: "Recuperação",
            classe: "recuperacao"
        };

    }


    return {
        texto: "Reprovado",
        classe: "reprovado"
    };

}


/* =====================================
   CALCULAR TUDO
===================================== */

function calcular() {

    const disciplinas =
        document.querySelectorAll(".disciplina");


    if (disciplinas.length === 0) {

        alert(
            "Adicione pelo menos uma disciplina."
        );

        return;

    }


    const pesos = obterPesos();


    if (pesos.every(peso => peso === 0)) {

        alert(
            "Pelo menos um peso deve ser maior que zero."
        );

        return;

    }


    const resultados = [];


    disciplinas.forEach((disciplina) => {

        const nome =
            disciplina
                .querySelector(".nome-disciplina")
                .value.trim();


        const inputs =
            disciplina.querySelectorAll(".nota-input");


        const notas =
            Array.from(inputs).map(input => {

                let valor = Number(input.value);

                if (input.value === "") {

                    valor = 0;

                }

                if (valor < 0 || valor > 10) {

                    valor = 0;

                }

                return valor;

            });


        const media =
            calcularMedia(notas, pesos);


        resultados.push({
            nome: nome || "Disciplina sem nome",
            notas,
            media
        });

    });


    mostrarResultados(resultados);

    salvarDados();

}


/* =====================================
   MOSTRAR RESULTADOS
===================================== */

function mostrarResultados(resultados) {

    const tabela =
        document.getElementById(
            "tabelaResultados"
        );


    tabela.innerHTML = "";


    resultados.forEach(resultado => {

        const situacao =
            obterSituacao(resultado.media);


        const tr =
            document.createElement("tr");


        let classeMedia =
            "media-baixa";


        if (resultado.media >= 7) {

            classeMedia =
                "media-alta";

        } else if (resultado.media >= 5) {

            classeMedia =
                "media-media";

        }


        tr.innerHTML = `

            <td>
                <strong>
                    ${resultado.nome}
                </strong>
            </td>

            <td>${formatarNota(resultado.notas[0])}</td>

            <td>${formatarNota(resultado.notas[1])}</td>

            <td>${formatarNota(resultado.notas[2])}</td>

            <td>${formatarNota(resultado.notas[3])}</td>

            <td class="${classeMedia}">
                ${resultado.media.toFixed(2)}
            </td>

            <td>

                <span
                    class="badge badge-${situacao.classe}"
                >
                    ${situacao.texto}
                </span>

            </td>

        `;


        tabela.appendChild(tr);

    });


    atualizarResumo(resultados);

}


/* =====================================
   RESUMO
===================================== */

function atualizarResumo(resultados) {

    const medias =
        resultados.map(item => item.media);


    const mediaGeral =
        medias.reduce(
            (total, media) => total + media,
            0
        ) / medias.length;


    const maior =
        Math.max(...medias);


    const menor =
        Math.min(...medias);


    const aprovadas =
        resultados.filter(
            item => item.media >= 7
        ).length;


    document.getElementById(
        "totalDisciplinas"
    ).textContent = resultados.length;


    document.getElementById(
        "mediaGeral"
    ).textContent =
        mediaGeral.toFixed(2);


    document.getElementById(
        "maiorMedia"
    ).textContent =
        maior.toFixed(2);


    document.getElementById(
        "menorMedia"
    ).textContent =
        menor.toFixed(2);


    const percentual =
        Math.min(
            Math.max(
                mediaGeral * 10,
                0
            ),
            100
        );


    document.getElementById(
        "barraProgresso"
    ).style.width =
        `${percentual}%`;


    document.getElementById(
        "porcentagem"
    ).textContent =
        `${percentual.toFixed(0)}%`;


    const situacao =
        document.getElementById(
            "situacaoGeral"
        );


    const situacaoGeral =
        obterSituacao(mediaGeral);


    situacao.textContent =
        situacaoGeral.texto;


    situacao.className =
        `situacao ${situacaoGeral.classe}`;


    const aluno =
        document.getElementById(
            "aluno"
        ).value.trim();


    document.getElementById(
        "nomeResultado"
    ).textContent =
        aluno
            ? `${aluno} • ${aprovadas} de ${resultados.length} disciplinas com média igual ou superior a 7.`
            : `${aprovadas} de ${resultados.length} disciplinas com média igual ou superior a 7.`;

}


/* =====================================
   FORMATAR NOTA
===================================== */

function formatarNota(valor) {

    return valor.toFixed(1);

}


/* =====================================
   SALVAR NO NAVEGADOR
===================================== */

function salvarDados() {

    const disciplinas =
        document.querySelectorAll(".disciplina");


    const dados = {

        aluno:
            document.getElementById(
                "aluno"
            ).value,

        turma:
            document.getElementById(
                "turma"
            ).value,

        ano:
            document.getElementById(
                "ano"
            ).value,

        disciplinas:
            Array.from(disciplinas).map(
                disciplina => {

                    return {

                        nome:
                            disciplina
                                .querySelector(
                                    ".nome-disciplina"
                                )
                                .value,

                        notas:
                            Array.from(
                                disciplina.querySelectorAll(
                                    ".nota-input"
                                )
                            ).map(
                                input =>
                                    input.value
                            )

                    };

                }
            )

    };


    localStorage.setItem(
        "etePalmaresMedia",
        JSON.stringify(dados)
    );

}


/* =====================================
   CARREGAR DADOS
===================================== */

function carregarDados() {

    const dadosSalvos =
        localStorage.getItem(
            "etePalmaresMedia"
        );


    if (!dadosSalvos) {

        adicionarDisciplina();

        adicionarDisciplina();

        adicionarDisciplina();

        return;

    }


    try {

        const dados =
            JSON.parse(dadosSalvos);


        document.getElementById(
            "aluno"
        ).value =
            dados.aluno || "";


        document.getElementById(
            "turma"
        ).value =
            dados.turma || "";


        document.getElementById(
            "ano"
        ).value =
            dados.ano || "2026";


        if (
            dados.disciplinas &&
            dados.disciplinas.length
        ) {

            dados.disciplinas.forEach(
                disciplina => {

                    adicionarDisciplina(
                        disciplina.nome,
                        disciplina.notas
                    );

                }
            );

        } else {

            adicionarDisciplina();

        }

    } catch {

        adicionarDisciplina();

    }

}


/* =====================================
   LIMPAR
===================================== */

function limparTudo() {

    const confirmar =
        confirm(
            "Tem certeza que deseja apagar todos os dados?"
        );


    if (!confirmar) {

        return;

    }


    document.getElementById(
        "aluno"
    ).value = "";


    document.getElementById(
        "turma"
    ).value = "";


    document.getElementById(
        "ano"
    ).value = "2026";


    disciplinasContainer.innerHTML = "";

    contador = 0;


    adicionarDisciplina();

    adicionarDisciplina();

    adicionarDisciplina();


    document.getElementById(
        "tabelaResultados"
    ).innerHTML = "";


    document.getElementById(
        "totalDisciplinas"
    ).textContent = "0";


    document.getElementById(
        "mediaGeral"
    ).textContent = "--";


    document.getElementById(
        "maiorMedia"
    ).textContent = "--";


    document.getElementById(
        "menorMedia"
    ).textContent = "--";


    document.getElementById(
        "porcentagem"
    ).textContent = "0%";


    document.getElementById(
        "barraProgresso"
    ).style.width = "0%";


    const situacao =
        document.getElementById(
            "situacaoGeral"
        );


    situacao.textContent =
        "Aguardando cálculo";


    situacao.className =
        "situacao";


    localStorage.removeItem(
        "etePalmaresMedia"
    );

}


/* =====================================
   EVENTOS
===================================== */

btnAdicionar.addEventListener(
    "click",
    () => adicionarDisciplina()
);


btnCalcular.addEventListener(
    "click",
    calcular
);


btnLimpar.addEventListener(
    "click",
    limparTudo
);


/* Salvar enquanto digita */

document.addEventListener(
    "input",
    () => {

        salvarDados();

    }
);


/* =====================================
   INICIALIZAÇÃO
===================================== */

carregarDados();