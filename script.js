let nomeUsuario;
const login = {};
let ultimaMensagem;
let pauseAtualizacao;

function retornaConexao(resposta){
    if(resposta.status === 400){
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
            `;
        }else if(mensagens[i].type === "message"){
            conteudo += `
                <div data-test="message" class="publica mensagem">
                    <p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}:</strong>  ${mensagens[i].text}</p>
                </div>
            `;
        }else if(mensagens[i].type === "private_message"){
            conteudo += `
                <div data-test="message" class="reservada mensagem">
                    <p><span>(${mensagens[i].time})</span>  <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}:</strong>  ${mensagens[i].text}</p>
                </div>
            `;
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
    const mensagemFiltrada  = resposta.data.filter( respostas => (respostas.from === login.name || respostas.to === login.name || respostas.to === "Todos" || respostas.type === "status" || respostas.type === "message"));
    mensagemNaTela(mensagemFiltrada);
}

function pegadoServidor(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(processaMensagens);
}

function deuCerto(){
    setInterval(mantemConexao, 5000);
    pauseAtualizacao = setInterval(pegadoServidor, 3000);
}

function deuErrado(erro){
    console.log("Deu erro");
    console.log(erro);
    alert("Usuario já logado ou usuario deslogado, tente outro usuario");
    window.location.reload()
}

function enviaMensagem(){
    const mensagemInput = document.querySelector("footer input");
    if(mensagemInput.value !== ""){
        const mensagemEnvio = {
            from: login.name,
            to: "Todos",
            text: mensagemInput.value,
            type: "message"
        }
        mensagemInput.value = "";
        const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemEnvio);
        promessa.then(pegadoServidor);
        promessa.catch(deuErrado);
    }
}

function escolheMensagem(){
    document.addEventListener("mouseup", function(event) {
        var obj = document.querySelector("aside");
        if (!obj.contains(event.target)) {
            alert("Outside click detected!");
        }
        else {
            alert("Inside click detected!");
        }
    });

    if(pauseAtualizacao !== undefined){
        clearInterval(pauseAtualizacao);
    }
    const menuLateral = document.querySelector("aside");
    const conteudo = document.querySelector(".tudo");

    menuLateral.classList.remove("esconde");
    conteudo.classList.add("opaco");
}

function inicia(){
    nomeUsuario = prompt("Digite o nome de Usuario");
    login.name = nomeUsuario;
    console.log(login);

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", login);

    promessa.then(deuCerto);
    promessa.catch(deuErrado);
}

document.addEventListener("keypress", function(tecla) {
    if(tecla.key === 'Enter') {
        const elemento = document.querySelector("footer ion-icon");
        elemento.click();
    }
});

inicia();