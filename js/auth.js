function login(){

let email=document.getElementById("email").value;

let password=document.getElementById("password").value;

if(email=="admin" && password=="1234"){

localStorage.setItem("sesion","activa");

window.location="dashboard.html";

}else{

alert("Datos incorrectos");

}

}
