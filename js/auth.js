async function login(){

let codigoLocal = document.getElementById("codigoLocal").value.trim();


if(codigoLocal==""){

alert("Ingresá el código de tu local");

return;

}


let { data, error } = await supabase

.from("locales")

.select("estado")

.eq("codigo", codigoLocal)

.single();


if(error || !data){

alert("Código de local no reconocido. Verificá con el proveedor del sistema.");

return;

}


if(data.estado != "activo"){

alert("Este local tiene el servicio suspendido. Contactate con el proveedor del sistema.");

return;

}


localStorage.setItem("sesion","activa");

localStorage.setItem("codigoLocal", codigoLocal);

window.location="dashboard.html";

}
