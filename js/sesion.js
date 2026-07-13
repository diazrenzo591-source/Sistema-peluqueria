// Protección de sesión: si no hay sesión activa, vuelve al login

if(localStorage.getItem("sesion") != "activa"){

window.location = "index.html";

}else{

// Verificación remota: si el local fue bloqueado, se cierra la sesión

let codigoLocal = localStorage.getItem("codigoLocal");

fetch(LICENCIAS_URL + "?t=" + Date.now())

.then(function(res){

return res.json();

})

.then(function(licencias){

let estado = licencias[codigoLocal];

if(estado != "activo"){

alert("El servicio de este local fue suspendido. Contactate con el proveedor del sistema.");

localStorage.removeItem("sesion");

localStorage.removeItem("codigoLocal");

window.location = "index.html";

}

})

.catch(function(error){

// Si no hay internet o falla la consulta, se deja seguir usando
// para no bloquear el trabajo diario por un problema de conexión

console.log("No se pudo verificar la licencia en este momento.");

});

}


function logout(){

localStorage.removeItem("sesion");

localStorage.removeItem("codigoLocal");

window.location = "index.html";

}
