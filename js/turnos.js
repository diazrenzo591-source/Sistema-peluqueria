let codigoLocal = localStorage.getItem("codigoLocal");

let clientesCache = [];

let serviciosCache = [];

let turnoEditId = null;



function minutosDesdeMedianoche(hora){

let partes = hora.split(":");

return Number(partes[0])*60 + Number(partes[1]);

}



function haySolapamiento(horaA, duracionA, horaB, duracionB){

let inicioA = minutosDesdeMedianoche(horaA);

let finA = inicioA + Number(duracionA || 30);

let inicioB = minutosDesdeMedianoche(horaB);

let finB = inicioB + Number(duracionB || 30);


return inicioA < finB && inicioB < finA;

}


// Mostrar / ocultar formulario

function mostrarTurno(){

let formulario = document.getElementById("formTurno");


if(formulario.style.display=="block"){

formulario.style.display="none";

turnoEditId = null;

}else{

turnoEditId = null;

limpiarFormularioTurno();

formulario.style.display="block";

}

}



function limpiarFormularioTurno(){

document.getElementById("cliente").value = "Seleccionar cliente";
document.getElementById("fecha").value = "";
document.getElementById("hora").value = "";
document.getElementById("servicio").value = "Seleccionar servicio";
document.getElementById("precioTurno").value = "";
document.getElementById("profesional").value = "Seleccionar profesional";
document.getElementById("estado").value = "Pendiente";
document.getElementById("formaPago").value = "Efectivo";

}



// Guardar turno (nuevo o editado)

async function guardarTurno(){


let cliente = document.getElementById("cliente").value;
let fecha = document.getElementById("fecha").value;
let hora = document.getElementById("hora").value;
let servicio = document.getElementById("servicio").value;
let profesional = document.getElementById("profesional").value;
let estado = document.getElementById("estado").value;
let precio = document.getElementById("precioTurno").value;
let formaPago = document.getElementById("formaPago").value;



if(cliente=="Seleccionar cliente"){

alert("Seleccioná un cliente");

return;

}


if(servicio=="Seleccionar servicio"){

alert("Seleccioná un servicio");

return;

}


if(profesional=="Seleccionar profesional"){

alert("Seleccioná un profesional");

return;

}


if(!fecha || !hora){

alert("Completá la fecha y la hora");

return;

}


// Si el cliente está bloqueado, avisar antes de continuar

let clienteInfo = clientesCache.find(
c => c.nombre == cliente.replace("🔒 ","")
);


if(clienteInfo && clienteInfo.bloqueado){

let continuar = confirm(
"⚠️ Este cliente está BLOQUEADO (pago pendiente).\n¿Igual querés cargarle el turno?"
);

if(!continuar) return;

}



// Verificar que el profesional no tenga otro turno que se superponga

let servicioElegido = serviciosCache.find(s=>s.nombre==servicio);

let duracionNueva = servicioElegido ? Number(servicioElegido.duracion) : 30;


let { data: turnosDelDia } = await sbClient

.from("turnos")

.select("id, hora, duracion, profesional, cliente")

.eq("codigo_local", codigoLocal)

.eq("fecha", fecha)

.neq("estado", "Cancelado");


let ocupado = (turnosDelDia || []).some(t =>

t.id != turnoEditId &&
t.profesional == profesional &&
haySolapamiento(hora, duracionNueva, t.hora, t.duracion)

);


if(ocupado){

alert("Ese profesional ya tiene un turno que se superpone con ese horario.");

return;

}



// Verificar que el cliente no tenga otro turno que se superponga

let clienteOcupado = (turnosDelDia || []).some(t =>

t.id != turnoEditId &&
t.cliente == cliente &&
haySolapamiento(hora, duracionNueva, t.hora, t.duracion)

);


if(clienteOcupado){

alert("Ese cliente ya tiene un turno que se superpone con ese horario.");

return;

}



let nuevoTurno = {

codigo_local: codigoLocal,
cliente: cliente,
fecha: fecha,
hora: hora,
servicio: servicio,
profesional: profesional,
estado: estado,
precio: precio,
forma_pago: formaPago,
duracion: duracionNueva

};


let error;


if(turnoEditId){

({ error } = await sbClient

.from("turnos")

.update(nuevoTurno)

.eq("id", turnoEditId));

turnoEditId = null;

}else{

({ error } = await sbClient

.from("turnos")

.insert(nuevoTurno));

}


if(error){

alert("Error al guardar el turno: " + error.message);

return;

}



mostrarTurnos();

mostrarTurno();



alert("Turno guardado");


}



// Mostrar turnos

async function mostrarTurnos(){


let tabla = document.getElementById("tablaTurnos");


if(!tabla)return;


let { data, error } = await sbClient

.from("turnos")

.select("*")

.eq("codigo_local", codigoLocal)

.order("fecha", { ascending: true })

.order("hora", { ascending: true });


if(error){

console.error(error);

tabla.innerHTML = `<tr><td colspan="7">Error al cargar los turnos</td></tr>`;

return;

}


tabla.innerHTML="";



data.forEach((turno)=>{


let acciones = "";


if(turno.estado!="Finalizado" && turno.estado!="Cancelado"){

acciones += `<button onclick="editarTurno('${turno.id}')">✏️</button> `;
acciones += `<button onclick="finalizarTurno('${turno.id}')">✅ Finalizar</button> `;
acciones += `<button onclick="cancelarTurno('${turno.id}')">🚫 Cancelar</button> `;

}


acciones += `<button onclick="recordarTurno('${turno.id}')">📲</button>`;


tabla.innerHTML += `

<tr>

<td>${turno.fecha}</td>

<td>${turno.hora}</td>


<td>${turno.cliente}</td>


<td>${turno.servicio}</td>


<td>${turno.profesional}</td>


<td>
<span class="estado ${turno.estado}">${turno.estado}</span>
</td>


<td>

${acciones}

</td>


</tr>

`;

});


}



// Cargar clientes en selector

async function cargarClientes(){


let select = document.getElementById("cliente");


if(!select)return;


let { data, error } = await sbClient

.from("clientes")

.select("*")

.eq("codigo_local", codigoLocal)

.order("nombre");


select.innerHTML = `

<option>
Seleccionar cliente
</option>

`;


if(error){

console.error(error);

return;

}


clientesCache = data;


data.forEach(function(cliente){


select.innerHTML += `

<option value="${cliente.nombre}">

${cliente.bloqueado ? "🔒 " : ""}${cliente.nombre}

</option>

`;

});


}



// Cargar servicios

async function cargarServicios(){


let select = document.getElementById("servicio");


if(!select)return;


let { data, error } = await sbClient

.from("servicios")

.select("*")

.eq("codigo_local", codigoLocal)

.order("nombre");


select.innerHTML = `

<option>
Seleccionar servicio
</option>

`;


if(error){

console.error(error);

return;

}


serviciosCache = data;


data.forEach(function(servicio){


select.innerHTML += `

<option value="${servicio.nombre}">

${servicio.nombre} - $${servicio.precio}

</option>

`;

});


}



// Cargar profesionales (empleados guardados en Supabase)

async function cargarProfesionales(){


let select = document.getElementById("profesional");


if(!select)return;


let { data, error } = await sbClient

.from("empleados")

.select("nombre")

.eq("codigo_local", codigoLocal)

.order("nombre");


select.innerHTML = `

<option>
Seleccionar profesional
</option>

`;


if(error){

console.error(error);

return;

}



data.forEach(function(empleado){


select.innerHTML += `

<option value="${empleado.nombre}">

${empleado.nombre}

</option>

`;

});


}



// Cargar precio automáticamente

let servicioSelect = document.getElementById("servicio");


if(servicioSelect){


servicioSelect.addEventListener("change",function(){


let nombre=this.value;



let servicio = serviciosCache.find(
s=>s.nombre==nombre
);



if(servicio){


document.getElementById("precioTurno").value =
servicio.precio;


}


});


}



// Editar turno existente

async function editarTurno(id){


let { data, error } = await sbClient

.from("turnos")

.select("*")

.eq("id", id)

.single();


if(error || !data){

alert("No se pudo cargar el turno");

return;

}


turnoEditId = id;


document.getElementById("cliente").value = data.cliente;
document.getElementById("fecha").value = data.fecha;
document.getElementById("hora").value = data.hora;
document.getElementById("servicio").value = data.servicio;
document.getElementById("precioTurno").value = data.precio;
document.getElementById("profesional").value = data.profesional;
document.getElementById("estado").value = data.estado;
document.getElementById("formaPago").value = data.forma_pago;


document.getElementById("formTurno").style.display = "block";


}



// Cancelar turno

async function cancelarTurno(id){


let confirmar = confirm(
"¿Seguro que querés cancelar este turno?"
);


if(!confirmar) return;


let { error } = await sbClient

.from("turnos")

.update({ estado: "Cancelado" })

.eq("id", id);


if(error){

alert("Error al cancelar: " + error.message);

return;

}


mostrarTurnos();


}



// Enviar recordatorio por WhatsApp

async function recordarTurno(id){


let { data: turno, error } = await sbClient

.from("turnos")

.select("*")

.eq("id", id)

.single();


if(error || !turno) return;


let cliente = clientesCache.find(
c => c.nombre == turno.cliente
);


if(!cliente || !cliente.telefono){

alert("Este cliente no tiene un teléfono cargado en su ficha.");

return;

}


let telefono = cliente.telefono.replace(/\D/g,"");


let mensaje =
`Hola ${turno.cliente}! Te recordamos tu turno el ${turno.fecha} a las ${turno.hora} para ${turno.servicio}. ¡Te esperamos!`;


let url =
`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;


window.open(url,"_blank");


}



// Finalizar turno

async function finalizarTurno(id){


let { data: turno, error } = await sbClient

.from("turnos")

.select("*")

.eq("id", id)

.single();


if(error || !turno) return;


await sbClient

.from("turnos")

.update({ estado: "Finalizado" })

.eq("id", id);



// Comisión empleado

let { data: empleado } = await sbClient

.from("empleados")

.select("*")

.eq("codigo_local", codigoLocal)

.eq("nombre", turno.profesional)

.maybeSingle();



if(empleado){


let comision =

Number(turno.precio) *
Number(empleado.comision) / 100;


await sbClient

.from("empleados")

.update({

ganancias: (Number(empleado.ganancias)||0) + comision

})

.eq("id", empleado.id);


}



// Enviar a caja

await sbClient

.from("caja")

.insert({

codigo_local: codigoLocal,
cliente: turno.cliente,
servicio: turno.servicio,
profesional: turno.profesional,
monto: Number(turno.precio),
forma_pago: turno.forma_pago,
fecha: new Date().toISOString()

});



alert("Turno finalizado y enviado a caja");



mostrarTurnos();


}




cargarClientes();

cargarServicios();

cargarProfesionales();

mostrarTurnos();
