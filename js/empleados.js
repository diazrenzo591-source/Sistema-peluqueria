
let empleados = JSON.parse(
localStorage.getItem("empleados")
) || [];

let empleadoEditarIndex = null;



function mostrarEmpleado(){

let formulario =
document.getElementById("formEmpleado");


if(formulario.style.display=="block"){

formulario.style.display="none";

}else{

formulario.style.display="block";

}

}



function guardarEmpleado(){


let nombre =
document.getElementById("nombreEmpleado").value;


let comision =
document.getElementById("comisionEmpleado").value;



if(nombre==""){

alert("Ingresá un nombre");

return;

}



empleados.push({

nombre,
comision,
ganancias:0

});



localStorage.setItem(
"empleados",
JSON.stringify(empleados)
);



mostrarEmpleados();


document.getElementById("nombreEmpleado").value = "";
document.getElementById("comisionEmpleado").value = "";


}



function mostrarEmpleados(){


let tabla =
document.getElementById("tablaEmpleados");


if(!tabla)return;


tabla.innerHTML="";



empleados.forEach((e,index)=>{


tabla.innerHTML += `

<tr>

<td>${e.nombre}</td>

<td>${e.comision}%</td>

<td>$${e.ganancias}</td>

<td>
<button onclick="abrirPerfil(${index})">
👤 Perfil
</button>
</td>

<td>

<button onclick="editarEmpleado(${index})">✏️ Editar</button>

<button onclick="eliminarEmpleado(${index})">🗑️ Eliminar</button>

</td>

</tr>

`;

});


}


mostrarEmpleados();


function abrirPerfil(index){

localStorage.setItem(
"empleadoSeleccionado",
empleados[index].nombre
);

window.location.href =
"perfil-empleado.html";

}



function editarEmpleado(index){

empleadoEditarIndex = index;

let empleado = empleados[index];


document.getElementById("editarNombreEmpleado").value = empleado.nombre;
document.getElementById("editarComisionEmpleado").value = empleado.comision;


document.getElementById("formEditarEmpleado").style.display = "block";


}



function guardarEdicionEmpleado(){


if(empleadoEditarIndex === null) return;


let empleado = empleados[empleadoEditarIndex];


empleado.nombre = document.getElementById("editarNombreEmpleado").value;
empleado.comision = document.getElementById("editarComisionEmpleado").value;


localStorage.setItem(
"empleados",
JSON.stringify(empleados)
);


document.getElementById("formEditarEmpleado").style.display = "none";

empleadoEditarIndex = null;


mostrarEmpleados();


alert("Empleado actualizado");


}



function eliminarEmpleado(index){


let confirmar = confirm(
"¿Seguro que querés eliminar este empleado? Sus turnos ya cargados no se van a borrar."
);


if(!confirmar) return;


empleados.splice(index,1);


localStorage.setItem(
"empleados",
JSON.stringify(empleados)
);


mostrarEmpleados();


}
