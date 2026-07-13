let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

let servicioEditarIndex = null;



function mostrarServicio(){

let formulario = document.getElementById("formServicio");


if(formulario.style.display=="block"){

formulario.style.display="none";

}else{

formulario.style.display="block";

}

}




function guardarServicio(){


let nombre = document.getElementById("nombreServicio").value;

let precio = document.getElementById("precioServicio").value;

let duracion = document.getElementById("duracionServicio").value;



if(nombre==""){

alert("Ingresá un nombre");

return;

}



let servicio = {

nombre,
precio,
duracion

};



servicios.push(servicio);



localStorage.setItem(
"servicios",
JSON.stringify(servicios)
);



mostrarServicios();


document.getElementById("nombreServicio").value = "";
document.getElementById("precioServicio").value = "";
document.getElementById("duracionServicio").value = "";


}



function mostrarServicios(){


let tabla = document.getElementById("tablaServicios");


if(!tabla)return;


tabla.innerHTML="";



servicios.forEach(function(servicio,index){


tabla.innerHTML += `

<tr>

<td>${servicio.nombre}</td>

<td>$${servicio.precio}</td>

<td>${servicio.duracion} min</td>

<td>

<button onclick="editarServicio(${index})">✏️ Editar</button>

<button onclick="eliminarServicio(${index})">🗑️ Eliminar</button>

</td>


</tr>

`;

});


}



function editarServicio(index){

servicioEditarIndex = index;

let servicio = servicios[index];


document.getElementById("editarNombreServicio").value = servicio.nombre;
document.getElementById("editarPrecioServicio").value = servicio.precio;
document.getElementById("editarDuracionServicio").value = servicio.duracion;


document.getElementById("formEditarServicio").style.display = "block";


}



function guardarEdicionServicio(){


if(servicioEditarIndex === null) return;


let servicio = servicios[servicioEditarIndex];


servicio.nombre = document.getElementById("editarNombreServicio").value;
servicio.precio = document.getElementById("editarPrecioServicio").value;
servicio.duracion = document.getElementById("editarDuracionServicio").value;


localStorage.setItem(
"servicios",
JSON.stringify(servicios)
);


document.getElementById("formEditarServicio").style.display = "none";

servicioEditarIndex = null;


mostrarServicios();


alert("Servicio actualizado");


}



function eliminarServicio(index){


let confirmar = confirm(
"¿Seguro que querés eliminar este servicio?"
);


if(!confirmar) return;


servicios.splice(index,1);


localStorage.setItem(
"servicios",
JSON.stringify(servicios)
);


mostrarServicios();


}



mostrarServicios();
