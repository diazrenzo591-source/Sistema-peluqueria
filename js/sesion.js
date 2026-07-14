// Protección de sesión: si no hay sesión activa, vuelve al login

if(localStorage.getItem("sesion") != "activa"){

window.location = "index.html";

}else{

verificarLicencia();

}


async function verificarLicencia(){

let codigoLocal = localStorage.getItem("codigoLocal");


try{

let { data, error } = await sbClient

.from("locales")

.select("estado")

.eq("codigo", codigoLocal)

.single();


if(error || !data || data.estado != "activo"){

alert("El servicio de este local fue suspendido. Contactate con el proveedor del sistema.");

localStorage.removeItem("sesion");

localStorage.removeItem("codigoLocal");

window.location = "index.html";

}

}catch(e){

console.log("No se pudo verificar la licencia en este momento.");

}

}


function logout(){

localStorage.removeItem("sesion");

localStorage.removeItem("codigoLocal");

window.location = "index.html";

}
