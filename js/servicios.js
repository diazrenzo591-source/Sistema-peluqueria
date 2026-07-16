let codigoLocal = localStorage.getItem("codigoLocal");

let servicioEditarId = null;



function mostrarServicio(){

let formulario = document.getElementById("formServicio");


formulario.style.display =
formulario.style.display=="block" ? "none" : "block";

}




async function guardarServicio(){


let nombre = document.getElementById("nombreServicio").value;

let precio = document.getElementById("precioServicio").value;

let duracion = document.getElementById("duracionServicio").value;



if(nombre==""){

alert("Ingresá un nombre");

return;

}



let { error } = await sbClient

.from("servicios")

.insert({

codigo_local: codigoLocal,
nombre: nombre,
precio: precio,
duracion: duracion

});


if(error){

alert("Error al guardar: " + error.message);

return;

}


document.getElementById("nombreServicio").value = "";
document.getElementById("precioServicio").value = "";
document.getElementById("duracionServicio").value = "";


mostrarServicios();


}



async function mostrarServicios(){


let tabla = document.getElementById("tablaServicios");


if(!tabla)return;


let { data, error } = await sbClient

.from("servicios")

.select("*")

.eq("codigo_local", codigoLocal)

.order("nombre");


if(error){

console.error(error);

tabla.innerHTML = `<tr><td colspan="4">Error al cargar servicios</td></tr>`;

return;

}


tabla.innerHTML="";



data.forEach(function(servicio){


tabla.innerHTML += `

<tr>

<td>${servicio.nombre}</td>

<td>$${servicio.precio}</td>

<td>${servicio.duracion} min</td>

<td>

<button onclick="editarServicio('${servicio.id}')">✏️ Editar</button>

<button onclick="eliminarServicio('${servicio.id}')">🗑️ Eliminar</button>

</td>


</tr>

`;

});


}



async function editarServicio(id){


let { data, error } = await sbClient

.from("servicios")

.select("*")

.eq("id", id)

.single();


if(error || !data){

alert("No se pudo cargar el servicio");

return;

}


servicioEditarId = id;


document.getElementById("editarNombreServicio").value = data.nombre;
document.getElementById("editarPrecioServicio").value = data.precio;
document.getElementById("editarDuracionServicio").value = data.duracion;


document.getElementById("formEditarServicio").style.display = "block";


}



async function guardarEdicionServicio(){


if(!servicioEditarId) return;


let nombre = document.getElementById("editarNombreServicio").value;
let precio = document.getElementById("editarPrecioServicio").value;
let duracion = document.getElementById("editarDuracionServicio").value;


let { error } = await sbClient

.from("servicios")

.update({

nombre: nombre,
precio: precio,
duracion: duracion

})

.eq("id", servicioEditarId);


if(error){

alert("Error al actualizar: " + error.message);

return;

}


document.getElementById("formEditarServicio").style.display = "none";

servicioEditarId = null;


mostrarServicios();


alert("Servicio actualizado");


}



async function eliminarServicio(id){


let confirmar = confirm(
"¿Seguro que querés eliminar este servicio?"
);


if(!confirmar) return;


let { error } = await sbClient

.from("servicios")

.delete()

.eq("id", id);


if(error){

alert("Error al eliminar: " + error.message);

return;

}


mostrarServicios();


}



mostrarServicios();
