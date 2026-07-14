let clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];

let codigoLocal = localStorage.getItem("codigoLocal");

let turnoEditId = null;

let turnosCache = [];


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


let clienteInfo = clientesGuardados.find(
c => c.nombre == cliente.replace("🔒 ","")
);


if(clienteInfo && clienteInfo.bloqueado){

let continuar = confirm(
"⚠️ Este cliente está BLOQUEADO (pago pendiente).\n¿Igual querés cargarle el turno?"
);

if(!continuar) return;

}


// Verificar si el profesional ya tiene un turno (ignorando el turno que se está editando)

let ocupado = turnosCache.find(t =>

t.fecha == fecha &&
t.hora == hora &&
t.profesional == profesional &&
t.estado != "Cancelado" &&
t.id != turnoEditId

);


if(ocupado){

alert("Ese profesional ya tiene un turno en ese horario.");

return;

}

let clienteOcupado = turnosCache.find(t =>

t.fecha == fecha &&
t.hora == hora &&
t.cliente == cliente &&
t.estado != "Cancelado" &&
t.id != turnoEditId

);


if(clienteOcupado){

alert("Ese cliente ya tiene un turno en ese horario.");

return;

}


let datosTurno = {

codigo_local: codigoLocal,
cliente: cliente,
fecha: fecha,
hora: hora,
servicio: servicio,
profesional: profesional,
estado: estado,
precio: precio,
forma_pago: formaPago

};


let error;


if(turnoEditId !== null){

let resultado = await sbClient

.from("turnos")

.update(datosTurno)

.eq("id", turnoEditId);

error = resultado.error;

turnoEditId = null;

}else{

let resultado = await sbClient

.from("turnos")

.insert(datosTurno);

error = resultado.error;

}


if(error){

alert("Error al guardar el turno: " + error.message);

return;

}


await mostrarTurnos();

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

.order("fecha", { ascending:false })

.order("hora", { ascending:true });


if(error){

console.error(error);

tabla.innerHTML = `<tr><td colspan="6">Error al cargar turnos</td></tr>`;

return;

}


turnosCache = data;


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


<td>${turno.fecha} ${turno.hora}</td>


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

function cargarClientes(){


let select = document.getElementById("cliente");


if(!select)return;



select.innerHTML = `

<option>
Seleccionar cliente
</option>

`;



clientesGuardados.forEach(function(cliente){


select.innerHTML += `

<option value="${cliente.nombre}">

${cliente.bloqueado ? "🔒 " : ""}${cliente.nombre}

</option>

`;

});


}



// Cargar servicios desde Supabase

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



data.forEach(function(servicio){


select.innerHTML += `

<option value="${servicio.nombre}" data-precio="${servicio.precio}">

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


let opcion = this.options[this.selectedIndex];

let precio = opcion.getAttribute("data-precio");


if(precio){

document.getElementById("precioTurno").value = precio;

}


});


}



// Editar turno existente

function editarTurno(id){


let turno = turnosCache.find(t=>t.id==id);

if(!turno) return;

turnoEditId = id;


document.getElementById("cliente").value = turno.cliente;
document.getElementById("fecha").value = turno.fecha;
document.getElementById("hora").value = turno.hora;
document.getElementById("servicio").value = turno.servicio;
document.getElementById("precioTurno").value = turno.precio;
document.getElementById("profesional").value = turno.profesional;
document.getElementById("estado").value = turno.estado;
document.getElementById("formaPago").value = turno.forma_pago;


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

.update({ estado:"Cancelado" })

.eq("id", id);


if(error){

alert("Error al cancelar: " + error.message);

return;

}


mostrarTurnos();


}



// Enviar recordatorio por WhatsApp

function recordarTurno(id){


let turno = turnosCache.find(t=>t.id==id);

if(!turno) return;


let cliente = clientesGuardados.find(
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


let turno = turnosCache.find(t=>t.id==id);

if(!turno) return;


let { error: errorTurno } = await sbClient

.from("turnos")

.update({ estado:"Finalizado" })

.eq("id", id);


if(errorTurno){

alert("Error al finalizar: " + errorTurno.message);

return;

}


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


// Enviar a caja (todavía en localStorage, se migra en el próximo paso)

let caja = JSON.parse(
localStorage.getItem("caja")
) || [];


caja.push({

cliente:turno.cliente,

servicio:turno.servicio,

profesional:turno.profesional,

monto:Number(turno.precio),

formaPago:turno.forma_pago,

fecha:new Date().toISOString()

});


localStorage.setItem(
"caja",
JSON.stringify(caja)
);


alert("Turno finalizado y enviado a caja");


mostrarTurnos();


}




cargarClientes();

cargarServicios();

cargarProfesionales();

mostrarTurnos();
