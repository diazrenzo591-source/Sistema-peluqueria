
// Protección de sesión: si no hay sesión activa, vuelve al login

if(localStorage.getItem("sesion") != "activa"){

window.location = "index.html";

}


function logout(){

localStorage.removeItem("sesion");

window.location = "index.html";

}
