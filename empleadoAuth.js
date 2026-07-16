async function loginEmpleado(){

try{

let codigoLocal = document.getElementById("codigoLocal").value.trim();
let usuario = document.getElementById("usuario").value.trim();
let clave = document.getElementById("clave").value;


if(codigoLocal=="" || usuario=="" || clave==""){

alert("Completá todos los campos");

return;

}


let { data, error } = await sbClient

.from("empleados")

.select("*")

.eq("codigo_local", codigoLocal)

.eq("usuario", usuario)

.eq("contrasena", clave)

.maybeSingle();


if(error){

console.error(error);

alert("Error al consultar el servicio: " + error.message);

return;

}


if(!data){

alert("Usuario o contraseña incorrectos.");

return;

}


// Chequear que el local siga activo, igual que en el panel de la barbería

let { data: local } = await sbClient

.from("locales")

.select("estado")

.eq("codigo", codigoLocal)

.single();


if(!local || local.estado != "activo"){

alert("El servicio de este local está suspendido.");

return;

}


localStorage.setItem("empleadoSesion","activa");

localStorage.setItem("empleadoId", data.id);

localStorage.setItem("empleadoLocal", codigoLocal);

window.location = "empleado-panel.html";


}catch(errorGeneral){

console.error(errorGeneral);

alert("Ocurrió un error inesperado: " + errorGeneral.message);

}

}
