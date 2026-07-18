async function loginEmpleado(){

try{

let codigoLocal = document.getElementById("codigoLocal").value.trim();
let usuario = document.getElementById("usuario").value.trim();
let clave = document.getElementById("clave").value;


if(codigoLocal=="" || usuario=="" || clave==""){

alert("Completá todos los campos");

return;

}


let email = codigoLocal + "-" + usuario + "@empleado.local";


let { data, error } = await sbClient.auth.signInWithPassword({

email: email,
password: clave

});


if(error){

alert("Usuario o contraseña incorrectos.");

return;

}


// Buscar el registro del empleado ligado a esta cuenta

let { data: empleado, error: errorEmpleado } = await sbClient

.from("empleados")

.select("*")

.eq("auth_id", data.user.id)

.maybeSingle();


if(!empleado){

alert("No encontramos tu perfil de empleado, o tu local está suspendido.");

await sbClient.auth.signOut();

return;

}


localStorage.setItem("empleadoId", empleado.id);

localStorage.setItem("empleadoLocal", empleado.codigo_local);

window.location = "empleado-panel.html";


}catch(errorGeneral){

console.error(errorGeneral);

alert("Ocurrió un error inesperado: " + errorGeneral.message);

}

}
