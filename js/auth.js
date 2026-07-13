function login(){

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;
let codigoLocal = document.getElementById("codigoLocal").value.trim();


if(email!="admin" || password!="1234"){

alert("Datos incorrectos");

return;

}


if(codigoLocal==""){

alert("Ingresá el código de tu local");

return;

}


fetch(LICENCIAS_URL + "?t=" + Date.now())

.then(function(res){

if(!res.ok) throw new Error("No se pudo consultar el servicio");

return res.json();

})

.then(function(licencias){

let estado = licencias[codigoLocal];


if(!estado){

alert("Código de local no reconocido. Verificá con el proveedor del sistema.");

return;

}


if(estado != "activo"){

alert("Este local tiene el servicio suspendido. Contactate con el proveedor del sistema.");

return;

}


localStorage.setItem("sesion","activa");

localStorage.setItem("codigoLocal", codigoLocal);

window.location="dashboard.html";

})

.catch(function(error){

alert("No se pudo verificar el estado del servicio. Revisá tu conexión a internet e intentá de nuevo.");

});

}
