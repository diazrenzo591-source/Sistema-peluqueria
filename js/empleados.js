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



try{


let { data: sessionData } = await sbClient.auth.getSession();


if(!sessionData.session){

alert("Tu sesión expiró, volvé a entrar.");

return;

}


let respuesta = await fetch(SUPABASE_URL + "/functions/v1/crear-empleado", {

method: "POST",

headers: {

"Content-Type": "application/json",
"Authorization": "Bearer " + sessionData.session.access_token

},

body: JSON.stringify({ nombre, comision, usuario, clave })

});


let resultado = await respuesta.json();


if(!respuesta.ok){

alert("Error al crear el empleado: " + (resultado.error || "desconocido"));

return;

}


document.getElementById("nombreEmpleado").value = "";
document.getElementById("comisionEmpleado").value = "";
document.getElementById("usuarioEmpleado").value = "";
document.getElementById("claveEmpleado").value = "";


mostrarEmpleados();


}catch(error){

alert("Error al crear el empleado: " + error.message);

}


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


document.getElementById("formEditarEmpleado").style.display = "block";


}



async function guardarEdicionEmpleado(){


if(!empleadoEditarId) return;


let nombre = document.getElementById("editarNombreEmpleado").value;
let comision = document.getElementById("editarComisionEmpleado").value;


let { error } = await sbClient

.from("empleados")

.update({ nombre: nombre, comision: comision })

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
