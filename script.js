let meuInterval;
let meuInterval2;
let meuInterval3;
let mensagens;
let usuarios;
let selecionados;
let usuarioSelecionado;
let usuarioSelecionadoNome;
let tipoMsg;
let texto = document.querySelector(".para-como");
let salvartipo;

function escreverMensagem(){
    let mensagem = document.querySelector("textarea");
    mensagem.classList.add("novo-estilo");
    mensagem.value = "";
    mensagem.defaultValue = "";
}

function abrirSidebar(){
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.add("mostrar-sidebar");
    document.querySelector(".top").classList.add("opaco");
    document.querySelector(".chat").classList.add("opaco");
    document.querySelector(".bot").classList.add("opaco");
}
function fecharSidebar(){
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.remove("mostrar-sidebar");
    document.querySelector(".top").classList.remove("opaco");
    document.querySelector(".chat").classList.remove("opaco");
    document.querySelector(".bot").classList.remove("opaco");
}

function cadastrarUsuario(){
    const usuario = {
        name: nome
    }
    const usuarioCadastrado = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    usuarioCadastrado.then(manterConexao);
    usuarioCadastrado.catch(alertaErro);
}

function alertaErro(erro){
    if(erro.response.status === 400){
        nome = prompt("Nome invalido, digite outro!")
        cadastrarUsuario();
    }
}

function manterConexao(resposta) {
    meuInterval = setInterval(usuarioOnline, 5000);
    meuInterval2 = setInterval(buscarMensagens, 3000);
    meuInterval3 = setInterval(buscarUsuarios, 10000);
}

function usuarioOnline(){
    const usuario = {
        name: nome
    }
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
}

function buscarUsuarios(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promessa.then(popularUsuarios);
}

function popularUsuarios(resposta){
    usuarios = resposta.data;
    const ulcontatos = document.querySelector(".contatos");

    ulcontatos.innerHTML = `<li class="Todos" onclick="selecionarContato(this)">
                                <ion-icon name="people"></ion-icon>Todos
                                <ion-icon name="checkmark-outline" class="hidden green contatinhos"></ion-icon>
                                </li>`
;

    for(let i = 0; i < usuarios.length;i++){
        if(nome === usuarios[i].name){
            ulcontatos.innerHTML += "";
        }else{
            ulcontatos.innerHTML += `<li class= "${usuarios[i].name}" onclick="selecionarContato(this)">
            <ion-icon name="people"></ion-icon>${usuarios[i].name}
            <ion-icon name="checkmark-outline" class="hidden green contatinhos"></ion-icon>
            </li>
            `;
        }
    }
}

function buscarMensagens(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(popularMensagens);
}

function popularMensagens(resposta){
    mensagens = resposta.data;
    const ulMensagens = document.querySelector(".chat");
    ulMensagens.innerHTML = "";
    for(let i = 0; i < mensagens.length; i++){
        if(mensagens[i].type === "status"){
            ulMensagens.innerHTML += `
            <li class="msg entrou-saiu">
                <p class="time">${mensagens[i].time}</p>&nbsp<strong>${mensagens[i].from}</strong>&nbsp${mensagens[i].text}
            </li>`    
        } else if(mensagens[i].type === "message"){
            ulMensagens.innerHTML += `
            <li class="msg msg-publica">
                <p class="time">${mensagens[i].time}</p>&nbsp<strong>${mensagens[i].from}</strong>&nbsppara&nbsp<strong>${mensagens[i].to}</strong>:&nbsp${mensagens[i].text}
            </li>`    
        } else if(mensagens[i].type === "private_message" && (mensagens[i].from === nome || mensagens[i].to === nome)){
            ulMensagens.innerHTML += `
            <li class="msg msg-privada">
                <p class="time">${mensagens[i].time}</p>&nbsp<strong>${mensagens[i].from}</strong>&nbspreservadamente&nbsppara&nbsp<strong>${mensagens[i].to}</strong>:&nbsp${mensagens[i].text}
            </li>` 
        }
    }
    document.querySelector(".msg:last-child").scrollIntoView();
}

function selecionado(elemento) {
    let selecionado = document.querySelectorAll(".visibilidade");
    if(elemento.classList.contains("publico")){
        selecionado[0].classList.remove("hidden");
        selecionado[1].classList.add("hidden");
        tipoMsg = "message";
        salvartipo =  `(Públicamente)`;
    } else if(elemento.classList.contains("reservado")){
        selecionado[0].classList.add("hidden");
        selecionado[1].classList.remove("hidden");
        tipoMsg = "private_message";
        salvartipo = `(Reservadamente)`;
    }
    texto.innerHTML = "";
    if(usuarioSelecionadoNome !== undefined){
        texto.innerHTML+= `Enviando para ${usuarioSelecionadoNome} ${salvartipo}`;
    }else{
        texto.innerHTML = "";
    }    
}

function selecionarContato(elemento){
    selecionados = document.querySelectorAll(".contatinhos");
    for(let i = 0; i < selecionados.length; i++){
        if(selecionados[i].parentNode === elemento){
            selecionados[i].classList.remove("hidden");
            usuarioSelecionado = elemento;
            usuarioSelecionadoNome = usuarioSelecionado.classList.value;
        }else{
            selecionados[i].classList.add("hidden");
        }
    }
    texto.innerHTML = "";
    if(salvartipo === undefined){
        salvartipo = "(Publicamente)";
    }
    texto.innerHTML+= `Enviando para ${usuarioSelecionadoNome} ${salvartipo}`;
}


function enviarMensagem() {
    let texto = document.querySelector("textarea").value;
    if(usuarioSelecionadoNome === undefined){
        usuarioSelecionadoNome = "Todos";
    }
    if(tipoMsg === undefined){
        tipoMsg = "message";
    }
    for(let i = 0; i < usuarios.length;i++){
        if(usuarioSelecionadoNome === usuarios[i].name || usuarioSelecionadoNome === "Todos"){
            let msg = {
                from: nome,
                to: usuarioSelecionadoNome,
                text: document.querySelector("textarea").value,
                type: tipoMsg
            }
            let enviar = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);
            escreverMensagem();    
            texto.innerHTML = "";
            return;    
        }
    }
    alert("usuario escolhido saiu da sala");
    window.location.reload();
}

let nome = prompt("Qual seu nome?");
cadastrarUsuario();
buscarMensagens();
buscarUsuarios();