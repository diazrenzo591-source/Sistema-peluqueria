let servicios = JSON.parse(localStorage.getItem("servicios")) || [];



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


}



function mostrarServicios(){


let tabla = document.getElementById("tablaServicios");


if(!tabla)return;


tabla.innerHTML="";



servicios.forEach(function(servicio){


tabla.innerHTML += `

<tr>

<td>${servicio.nombre}</td>

<td>$${servicio.precio}</td>

<td>${servicio.duracion} min</td>


</tr>

`;

});


}



mostrarServicios();
