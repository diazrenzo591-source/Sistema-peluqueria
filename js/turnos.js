let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

let clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];

let serviciosGuardados = JSON.parse(localStorage.getItem("servicios")) || [];


// Mostrar / ocultar formulario

function mostrarTurno(){

let formulario = document.getElementById("formTurno");


if(formulario.style.display=="block"){

formulario.style.display="none";

}else{

formulario.style.display="block";

}

}



// Guardar turno

function guardarTurno(){


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



let nuevoTurno = {

cliente:cliente,
fecha:fecha,
hora:hora,
servicio:servicio,
profesional:profesional,
estado:estado,
precio:precio,
formaPago:formaPago

};

// Verificar si el profesional ya tiene un turno

let ocupado = turnos.find(t =>

t.fecha == fecha &&
t.hora == hora &&
t.profesional == profesional &&
t.estado != "Cancelado"

);


if(ocupado){

alert("Ese profesional ya tiene un turno en ese horario.");

return;

}
let clienteOcupado = turnos.find(t =>

t.fecha == fecha &&
t.hora == hora &&
t.cliente == cliente &&
t.estado != "Cancelado"

);


if(clienteOcupado){

alert("Ese cliente ya tiene un turno en ese horario.");

return;

}

turnos.push(nuevoTurno);

localStorage.setItem(
"turnos",
JSON.stringify(turnos)
);



mostrarTurnos();

mostrarTurno();



alert("Turno guardado");


}



// Mostrar turnos

function mostrarTurnos(){


let tabla = document.getElementById("tablaTurnos");


if(!tabla)return;



tabla.innerHTML="";



turnos.forEach((turno,index)=>{


tabla.innerHTML += `

<tr>


<td>${turno.hora}</td>


<td>${turno.cliente}</td>


<td>${turno.servicio}</td>


<td>${turno.profesional}</td>


<td>
<span class="estado ${turno.estado}">${turno.estado}</span>
</td>


<td>

${turno.estado!="Finalizado" && turno.estado!="Cancelado" ?
`<button onclick="finalizarTurno(${index})">Finalizar</button>` :
""}

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

${cliente.nombre}

</option>

`;

});


}



// Cargar servicios

function cargarServicios(){


let select = document.getElementById("servicio");


if(!select)return;



select.innerHTML = `

<option>
Seleccionar servicio
</option>

`;



serviciosGuardados.forEach(function(servicio){


select.innerHTML += `

<option value="${servicio.nombre}">

${servicio.nombre} - $${servicio.precio}

</option>

`;

});


}



// Cargar precio automáticamente

let servicioSelect = document.getElementById("servicio");


if(servicioSelect){


servicioSelect.addEventListener("change",function(){


let nombre=this.value;



let servicio = serviciosGuardados.find(
s=>s.nombre==nombre
);



if(servicio){


document.getElementById("precioTurno").value =
servicio.precio;


}


});


}



// Finalizar turno

function finalizarTurno(index){


let turno = turnos[index];



turno.estado="Finalizado";



// Comisión empleado

let empleados = JSON.parse(
localStorage.getItem("empleados")
) || [];



let empleado = empleados.find(
e=>e.nombre==turno.profesional
);



if(empleado){


let comision =

Number(turno.precio) *
Number(empleado.comision) / 100;



empleado.ganancias = (empleado.ganancias || 0) + comision;



localStorage.setItem(
"empleados",
JSON.stringify(empleados)
);


}



// Enviar a caja


let caja = JSON.parse(
localStorage.getItem("caja")
) || [];



caja.push({

cliente:turno.cliente,

servicio:turno.servicio,

monto:Number(turno.precio),

formaPago:turno.formaPago,

fecha:new Date().toISOString()

});



localStorage.setItem(
"caja",
JSON.stringify(caja)
);



localStorage.setItem(
"turnos",
JSON.stringify(turnos)
);



alert("Turno finalizado y enviado a caja");



mostrarTurnos();


}




cargarClientes();

cargarServicios();

mostrarTurnos();
