
let empleados = JSON.parse(
localStorage.getItem("empleados")
) || [];



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
