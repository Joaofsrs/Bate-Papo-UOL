const login = {
    name: "Pedrinho"
};

function retornaConexao(resposta){
    if(resposta.status !== 200){
        console.log("Deu erro na conexão")
        console.log("Erro numero "+resposta.status);
    }
}

function mantemConexao(){
    const continua = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", login);
    continua.then(retornaConexao);
    continua.catch(retornaConexao);
}

function mensagemNaTela(mensagens){
    const mainTela = document.querySelector("main");
    let conteudo = '';
    for(let i = 0; i < mensagens.length; i++){
        if(mensagens[i].type === "status"){
            conteudo += `
                <div class="servidor mensagem">
                    <p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong>  ${mensagens[i].text}</p>
                </div>
            `
        }else if(mensagens[i].type === "message"){
            conteudo += `
                <div class="publica mensagem">
                    <p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}:</strong>  ${mensagens[i].text}</p>
                </div>
            `
        }else if(mensagens[i].type === "private_message"){
            conteudo += `
                <div class="reservada mensagem">
                    <p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}:</strong>  ${mensagens.text}</p>
                </div>
            `
        }
    }
    mainTela.innerHTML = conteudo;
    const elementoQueQueroQueApareca = document.querySelectorAll('.mensagem');
    elementoQueQueroQueApareca[elementoQueQueroQueApareca.length-1].scrollIntoView();
}

function processaMensagens(resposta){
    const mensagemFiltrada  = resposta.data.filter( resposta => (resposta.from === login.name || resposta.to === login.name || resposta.to === "Todos" || resposta.type === "status" || resposta.type === "message"));
    mensagemNaTela(mensagemFiltrada);
}

function pegadoServidor(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(processaMensagens);
}

function deuCerto(resposta){
    setInterval(mantemConexao, 5000);
    setInterval(pegadoServidor, 3000);
}

function deuErrado(erro){
    console.log("Deu erro");
    console.log(erro);
}

function inicia(){
    const continuar = prompt("Digite alguma coisa para continuar");

    if(continuar === "1"){
        const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", login);

        promessa.then(deuCerto);
        promessa.catch(deuErrado);
    }
}

inicia();