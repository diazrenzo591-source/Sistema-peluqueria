// Obtener el código de local desde el link (ej: reservar.html?local=renzo01)

let params = new URLSearchParams(window.location.search);

let codigoLocal = params.get("local");


let serviciosCache = [];

let empleadosCache = [];


let HORA_APERTURA = "09:00";

let HORA_CIERRE = "20:00";

let INTERVALO_MINUTOS = 15;



function minutosDesdeMedianoche(hora){

let partes = hora.split(":");

return Number(partes[0])*60 + Number(partes[1]);

}


function minutosAHora(minutos){

let h = Math.floor(minutos/60);

let m = minutos%60;

return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0");

}


function haySolapamiento(inicioA, duracionA, inicioB, duracionB){

let finA = inicioA + Number(duracionA || 30);

let finB = inicioB + Number(duracionB || 30);


return inicioA < finB && inicioB < finA;

}



async function iniciar(){


if(!codigoLocal){

mostrarError("Este link no es válido. Pedile a tu barbería el link correcto para reservar.");

return;

}


let { data: local, error } = await sbClient

.from("locales")

.select("*")

.eq("codigo", codigoLocal)

.maybeSingle();


if(error || !local){

mostrarError("No encontramos esta barbería. Verificá el link.");

return;

}


if(local.estado != "activo"){

mostrarError("Esta barbería no está aceptando reservas en este momento.");

return;

}


if(local.nombre){

document.getElementById("nombreLocal").innerHTML =
"📅 Reservar turno - " + local.nombre;

}


cargarServicios();

cargarProfesionales();


document.getElementById("profesional").addEventListener("change", async function(){

await mostrarPerfilProfesional(this.value);

actualizarHorariosDisponibles();

});


document.getElementById("fecha").addEventListener("change", actualizarHorariosDisponibles);


document.getElementById("servicio").addEventListener("change", actualizarHorariosDisponibles);


}



function mostrarError(mensaje){

document.getElementById("textoError").innerHTML = mensaje;

document.getElementById("mensajeError").style.display = "block";

document.getElementById("formularioReserva").style.display = "none";

}



async function cargarServicios(){


let { data, error } = await sbClient

.from("servicios")

.select("*")

.eq("codigo_local", codigoLocal)

.order("nombre");


let select = document.getElementById("servicio");

select.innerHTML = `<option>Seleccionar servicio</option>`;


if(error) return;


serviciosCache = data;


data.forEach(s=>{

select.innerHTML += `<option value="${s.nombre}">${s.nombre} - $${s.precio} (${s.duracion} min)</option>`;

});


}



async function cargarProfesionales(){


let { data, error } = await sbClient

.from("empleados")

.select("*")

.eq("codigo_local", codigoLocal)

.order("nombre");


let select = document.getElementById("profesional");

select.innerHTML = `<option>Seleccionar profesional</option>`;


if(error) return;


empleadosCache = data;


data.forEach(e=>{

select.innerHTML += `<option value="${e.nombre}">${e.nombre}${e.especialidad ? " - "+e.especialidad : ""}</option>`;

});


}



async function mostrarPerfilProfesional(nombre){


let contenedor = document.getElementById("perfilProfesional");

let empleado = empleadosCache.find(e=>e.nombre==nombre);


if(!empleado){

contenedor.innerHTML = "";

return;

}


let { data: trabajos } = await sbClient

.from("trabajos")

.select("*")

.eq("empleado_id", empleado.id)

.order("fecha", { ascending:false })

.limit(6);


let galeriaHTML = "";


if(trabajos && trabajos.length > 0){

galeriaHTML = `<p style="margin-top:10px;"><strong>Sus trabajos</strong></p>
<div style="display:flex;gap:8px;overflow-x:auto;margin-top:5px;">` +

trabajos.map(t=>{

return t.tipo=="video"

? `<video src="${t.url_despues}" style="width:90px;height:90px;object-fit:cover;border-radius:10px;flex-shrink:0;" muted></video>`

: `<img src="${t.url_despues}" style="width:90px;height:90px;object-fit:cover;border-radius:10px;flex-shrink:0;">`;

}).join("") +

`</div>`;

}


contenedor.innerHTML = `

<div class="card" style="margin:15px 0;">

${empleado.foto ? `<img src="${empleado.foto}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">` : ""}

<p><strong>${empleado.nombre}</strong></p>

${empleado.especialidad ? `<p>✂️ ${empleado.especialidad}</p>` : ""}

${empleado.experiencia ? `<p>${empleado.experiencia}</p>` : ""}

${galeriaHTML || "<p style='color:#aaa;font-size:13px;'>Todavía no subió trabajos.</p>"}

</div>

`;


}



async function actualizarHorariosDisponibles(){


let profesional = document.getElementById("profesional").value;

let fecha = document.getElementById("fecha").value;

let servicio = document.getElementById("servicio").value;


let selectHora = document.getElementById("hora");


if(profesional=="Seleccionar profesional" || !fecha || servicio=="Seleccionar servicio"){

selectHora.innerHTML = `<option>Elegí servicio, profesional y fecha primero</option>`;

return;

}


let servicioInfo = serviciosCache.find(s=>s.nombre==servicio);

let duracion = servicioInfo ? Number(servicioInfo.duracion) : 30;


let { data, error } = await sbClient

.from("turnos")

.select("hora, duracion")

.eq("codigo_local", codigoLocal)

.eq("profesional", profesional)

.eq("fecha", fecha)

.neq("estado", "Cancelado");


if(error){

console.error(error);

return;

}


let ocupados = data || [];


let inicioApertura = minutosDesdeMedianoche(HORA_APERTURA);

let inicioCierre = minutosDesdeMedianoche(HORA_CIERRE);


let libres = [];


for(let inicio = inicioApertura; inicio + duracion <= inicioCierre; inicio += INTERVALO_MINUTOS){


let choca = ocupados.some(t =>

haySolapamiento(inicio, duracion, minutosDesdeMedianoche(t.hora), t.duracion)

);


if(!choca){

libres.push(minutosAHora(inicio));

}


}


if(libres.length==0){

selectHora.innerHTML = `<option>No hay horarios libres ese día para este servicio</option>`;

return;

}


selectHora.innerHTML = libres.map(h=>`<option value="${h}">${h}</option>`).join("");


}



async function reservarTurno(){


let nombre = document.getElementById("nombreCliente").value.trim();

let telefono = document.getElementById("telefonoCliente").value.trim();

let servicio = document.getElementById("servicio").value;

let profesional = document.getElementById("profesional").value;

let fecha = document.getElementById("fecha").value;

let hora = document.getElementById("hora").value;



if(nombre==""){ alert("Ingresá tu nombre"); return; }

if(telefono==""){ alert("Ingresá tu teléfono"); return; }

if(servicio=="Seleccionar servicio"){ alert("Elegí un servicio"); return; }

if(profesional=="Seleccionar profesional"){ alert("Elegí un profesional"); return; }

if(!fecha){ alert("Elegí una fecha"); return; }

if(!hora || hora=="Elegí profesional y fecha primero" || hora=="No hay horarios libres ese día"){

alert("Elegí un horario disponible");

return;

}



// Verificar que el horario siga libre (por si alguien más reservó justo antes)

let servicioInfo = serviciosCache.find(s=>s.nombre==servicio);

let duracion = servicioInfo ? Number(servicioInfo.duracion) : 30;


let { data: turnosDelDia } = await sbClient

.from("turnos")

.select("hora, duracion")

.eq("codigo_local", codigoLocal)

.eq("profesional", profesional)

.eq("fecha", fecha)

.neq("estado", "Cancelado");


let choca = (turnosDelDia || []).some(t =>

haySolapamiento(

minutosDesdeMedianoche(hora), duracion,
minutosDesdeMedianoche(t.hora), t.duracion

)

);


if(choca){

alert("Uy, justo se ocupó ese horario. Elegí otro.");

actualizarHorariosDisponibles();

return;

}



// Buscar si el cliente ya existe (por teléfono); si no, crearlo

let { data: clienteExistente } = await sbClient

.from("clientes")

.select("*")

.eq("codigo_local", codigoLocal)

.eq("telefono", telefono)

.maybeSingle();


if(clienteExistente && clienteExistente.bloqueado){

alert("No pudimos procesar tu reserva. Comunicate directamente con la barbería.");

return;

}


if(!clienteExistente){

await sbClient.from("clientes").insert({

codigo_local: codigoLocal,
nombre: nombre,
telefono: telefono,
bloqueado: false

});

}



// Buscar precio del servicio elegido

let { error } = await sbClient.from("turnos").insert({

codigo_local: codigoLocal,
cliente: nombre,
fecha: fecha,
hora: hora,
servicio: servicio,
profesional: profesional,
estado: "Pendiente",
precio: servicioInfo ? servicioInfo.precio : null,
duracion: duracion,
forma_pago: null

});


if(error){

alert("Error al reservar: " + error.message);

return;

}



document.getElementById("formularioReserva").innerHTML = `

<h2>✅ ¡Listo!</h2>

<p>Tu turno quedó pendiente de confirmación. La barbería se va a contactar con vos para confirmarlo.</p>

`;


}



iniciar();
