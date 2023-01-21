let nomeUsuario;
let login = {};
let ultimaMensagem;

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
                <div data-test="message" class="servidor mensagem">
                    <p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong>  ${mensagens[i].text}</p>
                </div>
            `
        }else if(mensagens[i].type === "message"){
            conteudo += `
                <div data-test="message" class="publica mensagem">
                    <p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}:</strong>  ${mensagens[i].text}</p>
                </div>
            `
        }else if(mensagens[i].type === "private_message"){
            conteudo += `
                <div data-test="message" class="reservada mensagem">
                    <p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}:</strong>  ${mensagens[i].text}</p>
                </div>
            `
        }
    }
    mainTela.innerHTML = conteudo;
    const elementoQueQueroQueApareca = document.querySelectorAll('.mensagem');
    if(ultimaMensagem !== elementoQueQueroQueApareca[elementoQueQueroQueApareca.length-1].innerHTML){
        elementoQueQueroQueApareca[elementoQueQueroQueApareca.length-1].scrollIntoView();
        ultimaMensagem = elementoQueQueroQueApareca[elementoQueQueroQueApareca.length-1].innerHTML;
    }
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
    //console.log(resposta);
    setInterval(mantemConexao, 5000);
    setInterval(pegadoServidor, 3000);
}

function deuErrado(erro){
    console.log("Deu erro");
    console.log(erro);
    alert("Usuario já logado ou usuario deslogado, tente outro usuario");
    inicia(); 
}

function enviaMensagem(){
    const mensagemInput = document.querySelector("footer input");
    //const nomeRemetente = prompt("Digite o nome do remetente");
    //console.log(mensagemInput.value);
    const mensagemEnvio = {
        from: login.name,
        to: "Todos",
        text: mensagemInput.value,
        type: "message" // ou "private_message" para o bônus
    }
    mensagemInput.value = "";
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemEnvio);
    promessa.then(pegadoServidor);
    promessa.catch(deuErrado);
}

function inicia(){
    nomeUsuario = prompt("Digite o nome de Usuario");
    login.name = nomeUsuario;
    console.log(login);

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", login);

    promessa.then(deuCerto);
    promessa.catch(deuErrado);
}

inicia();