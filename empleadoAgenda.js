let empleadoId = localStorage.getItem("empleadoId");

let empleadoLocal = localStorage.getItem("empleadoLocal");

let empleadoNombre = null;

let empleadoComision = 0;



async function iniciar(){


let { data, error } = await sbClient

.from("empleados")

.select("*")

.eq("id", empleadoId)

.single();


if(error || !data){

alert("No se pudo cargar tu perfil");

return;

}


empleadoNombre = data.nombre;

empleadoComision = data.comision;


mostrarAgendaEmpleado();


}



async function mostrarAgendaEmpleado(){


let tabla = document.getElementById("tablaAgendaEmpleado");

if(!tabla) return;


let hoy = new Date().toISOString().split("T")[0];


let { data, error } = await sbClient

.from("turnos")

.select("*")

.eq("codigo_local", empleadoLocal)

.eq("profesional", empleadoNombre)

.gte("fecha", hoy)

.order("fecha", { ascending:true })

.order("hora", { ascending:true });


if(error){

console.error(error);

tabla.innerHTML = `<tr><td colspan="6">Error al cargar tu agenda</td></tr>`;

return;

}


tabla.innerHTML = "";


if(data.length==0){

tabla.innerHTML = `<tr><td colspan="6">No tenés turnos próximos</td></tr>`;

return;

}


data.forEach(turno=>{


let acciones = "";


if(turno.estado=="Pendiente"){

acciones += `<button onclick="confirmarTurno('${turno.id}')">✅ Aceptar</button> `;
acciones += `<button onclick="rechazarTurno('${turno.id}')">❌ Rechazar</button>`;

}else if(turno.estado=="Confirmado"){

acciones += `<button onclick="finalizarTurnoEmpleado('${turno.id}')">✔️ Finalizar</button> `;
acciones += `<button onclick="rechazarTurno('${turno.id}')">🚫 Cancelar</button>`;

}


tabla.innerHTML += `

<tr>

<td>${turno.fecha}</td>

<td>${turno.hora}</td>

<td>${turno.cliente}</td>

<td>${turno.servicio}</td>

<td>
<span class="estado ${turno.estado}">${turno.estado}</span>
</td>

<td>${acciones}</td>

</tr>

`;

});


}



async function confirmarTurno(id){


let { error } = await sbClient

.from("turnos")

.update({ estado: "Confirmado" })

.eq("id", id);


if(error){

alert("Error: " + error.message);

return;

}


mostrarAgendaEmpleado();


}



async function rechazarTurno(id){


let confirmar = confirm(
"¿Seguro que querés cancelar este turno?"
);


if(!confirmar) return;


let { error } = await sbClient

.from("turnos")

.update({ estado: "Cancelado" })

.eq("id", id);


if(error){

alert("Error: " + error.message);

return;

}


mostrarAgendaEmpleado();


}



async function finalizarTurnoEmpleado(id){


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



let comision = Number(turno.precio) * Number(empleadoComision) / 100;


let { data: empleadoActual } = await sbClient

.from("empleados")

.select("ganancias")

.eq("id", empleadoId)

.single();


await sbClient

.from("empleados")

.update({

ganancias: (Number(empleadoActual.ganancias)||0) + comision

})

.eq("id", empleadoId);



await sbClient

.from("caja")

.insert({

codigo_local: empleadoLocal,
cliente: turno.cliente,
servicio: turno.servicio,
profesional: empleadoNombre,
monto: Number(turno.precio),
forma_pago: turno.forma_pago,
fecha: new Date().toISOString()

});



alert("Turno finalizado. Ya se sumó a la Caja de la barbería.");


mostrarAgendaEmpleado();


}



iniciar();
