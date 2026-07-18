async function login(){

try{

let codigoLocal = document.getElementById("codigoLocal").value.trim();
let password = document.getElementById("password").value;


if(codigoLocal=="" || password==""){

alert("Completá el código de tu local y la contraseña");

return;

}


let email = codigoLocal + "@barberia.local";


let { data, error } = await sbClient.auth.signInWithPassword({

email: email,
password: password

});


if(error){

alert("Código o contraseña incorrectos.");

return;

}


// Confirmar que hay un local activo asociado a esta cuenta

let { data: local, error: errorLocal } = await sbClient

.from("locales")

.select("*")

.eq("codigo", codigoLocal)

.maybeSingle();


if(!local){

alert("No encontramos un local asociado a esta cuenta.");

await sbClient.auth.signOut();

return;

}


if(local.estado != "activo"){

alert("Este local tiene el servicio suspendido. Contactate con el proveedor del sistema.");

await sbClient.auth.signOut();

return;

}


localStorage.setItem("codigoLocal", codigoLocal);

window.location="dashboard.html";


}catch(errorGeneral){

console.error(errorGeneral);

alert("Ocurrió un error inesperado: " + errorGeneral.message);

}

}
