let codigoLocal = localStorage.getItem("codigoLocal");

let empleadoEditarId = null;



function mostrarEmpleado(){

let formulario =
document.getElementById("formEmpleado");

formulario.style.display =
formulario.style.display=="block" ? "none" : "block";

}



async function guardarEmpleado(){


let nombre =
document.getElementById("nombreEmpleado").value;


let comision =
document.getElementById("comisionEmpleado").value;


let usuario =
document.getElementById("usuarioEmpleado").value.trim();


let clave =
document.getElementById("claveEmpleado").value;



if(nombre==""){

alert("Ingresá un nombre");

return;

}


if(usuario==""){

alert("Ingresá un usuario para que el empleado pueda ingresar a su portal");

return;

}


if(clave==""){

alert("Ingresá una contraseña para el empleado");

return;

}



let { error } = await sbClient

.from("empleados")

.insert({

codigo_local: codigoLocal,
nombre: nombre,
comision: comision,
ganancias: 0,
usuario: usuario,
contrasena: clave

});


if(error){

alert("Error al guardar: " + error.message);

return;

}


document.getElementById("nombreEmpleado").value = "";
document.getElementById("comisionEmpleado").value = "";
document.getElementById("usuarioEmpleado").value = "";
document.getElementById("claveEmpleado").value = "";


mostrarEmpleados();


}



async function mostrarEmpleados(){


let tabla =
document.getElementById("tablaEmpleados");


if(!tabla)return;


let { data, error } = await sbClient

.from("empleados")

.select("*")

.eq("codigo_local", codigoLocal)

.order("nombre");


if(error){

console.error(error);

tabla.innerHTML = `<tr><td colspan="5">Error al cargar empleados</td></tr>`;

return;

}


tabla.innerHTML="";



data.forEach(e=>{


tabla.innerHTML += `

<tr>

<td>${e.nombre}</td>

<td>${e.comision}%</td>

<td>$${e.ganancias}</td>

<td>
<button onclick="abrirPerfil('${e.id}')">
👤 Perfil
</button>
</td>

<td>

<button onclick="editarEmpleado('${e.id}')">✏️ Editar</button>

<button onclick="eliminarEmpleado('${e.id}')">🗑️ Eliminar</button>

</td>

</tr>

`;

});


}


mostrarEmpleados();


function abrirPerfil(id){

localStorage.setItem(
"empleadoSeleccionado",
id
);

window.location.href =
"perfil-empleado.html";

}



async function editarEmpleado(id){

empleadoEditarId = id;


let { data, error } = await sbClient

.from("empleados")

.select("*")

.eq("id", id)

.single();


if(error || !data){

alert("No se pudo cargar el empleado");

return;

}


document.getElementById("editarNombreEmpleado").value = data.nombre;
document.getElementById("editarComisionEmpleado").value = data.comision;
document.getElementById("editarUsuarioEmpleado").value = data.usuario || "";
document.getElementById("editarClaveEmpleado").value = "";


document.getElementById("formEditarEmpleado").style.display = "block";


}



async function guardarEdicionEmpleado(){


if(!empleadoEditarId) return;


let nombre = document.getElementById("editarNombreEmpleado").value;
let comision = document.getElementById("editarComisionEmpleado").value;
let usuario = document.getElementById("editarUsuarioEmpleado").value.trim();
let clave = document.getElementById("editarClaveEmpleado").value;


let cambios = {

nombre: nombre,
comision: comision,
usuario: usuario

};


if(clave != ""){

cambios.contrasena = clave;

}


let { error } = await sbClient

.from("empleados")

.update(cambios)

.eq("id", empleadoEditarId);


if(error){

alert("Error al actualizar: " + error.message);

return;

}


document.getElementById("formEditarEmpleado").style.display = "none";

empleadoEditarId = null;


mostrarEmpleados();


alert("Empleado actualizado");


}



async function eliminarEmpleado(id){


let confirmar = confirm(
"¿Seguro que querés eliminar este empleado? Sus turnos ya cargados no se van a borrar."
);


if(!confirmar) return;


let { error } = await sbClient

.from("empleados")

.delete()

.eq("id", id);


if(error){

alert("Error al eliminar: " + error.message);

return;

}


mostrarEmpleados();


}
