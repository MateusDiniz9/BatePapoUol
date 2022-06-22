function escreverMensagem(){
    let mensagem = document.querySelector("input");
    console.log(mensagem);
    mensagem.defaultValue = "";
}

function abrirSidebar(){
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.add("mostrar-sidebar");
    document.querySelector(".top").classList.add("opaco");
    document.querySelector(".chat").classList.add("opaco");
    document.querySelector(".bot").classList.add("opaco");
}

function cadastrarUsuario(){
    let usuario = prompt("Qual seu nome?")
}

cadastrarUsuario();