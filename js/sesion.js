// Protección de sesión usando Supabase Auth de verdad

(async function(){

let { data } = await sbClient.auth.getSession();


if(!data.session){

window.location = "index.html";

return;

}


// Verificar que el local siga activo (por si lo bloquean mientras se usa)

let codigoLocal = localStorage.getItem("codigoLocal");


let { data: local, error } = await sbClient

.from("locales")

.select("estado")

.eq("codigo", codigoLocal)

.maybeSingle();


if(!local || local.estado != "activo"){

alert("El servicio de este local fue suspendido. Contactate con el proveedor del sistema.");

await sbClient.auth.signOut();

localStorage.removeItem("codigoLocal");

window.location = "index.html";

}


})();



async function logout(){

await sbClient.auth.signOut();

localStorage.removeItem("codigoLocal");

window.location = "index.html";

}
