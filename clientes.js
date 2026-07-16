let codigoLocal = localStorage.getItem("codigoLocal");

let clienteEditarId = null;



function mostrarFormulario(){

let formulario = document.getElementById("formulario");


if(formulario.style.display=="block"){

formulario.style.display="none";


}else{


formulario.style.display="block";


document.getElementById("nombre").value="";
document.getElementById("telefono").value="";
document.getElementById("fecha").value="";
document.getElementById("servicio").value="";
document.getElementById("notas").value="";


}

}



async function guardarCliente(){


let nombre = document.getElementById("nombre").value;
let telefono = document.getElementById("telefono").value;
let fecha = document.getElementById("fecha").value;
let servicio = document.getElementById("servicio").value;
let notas = document.getElementById("notas").value;



if(nombre==""){

alert("Ingresá un nombre");

return;

}



let { error } = await sbClient

.from("clientes")

.insert({

codigo_local: codigoLocal,
nombre: nombre,
telefono: telefono,
fecha: fecha || null,
servicio: servicio,
notas: notas,
bloqueado: false

});


if(error){

alert("Error al guardar: " + error.message);

return;

}


mostrarClientes();

mostrarFormulario();


alert("Cliente agregado");


}



async function mostrarClientes(){

let tabla = document.getElementById("tablaClientes");

if(!tabla) return;


let { data, error } = await sbClient

.from("clientes")

.select("*")

.eq("codigo_local", codigoLocal)

.order("nombre");


if(error){

console.error(error);

tabla.innerHTML = `<tr><td colspan="6">Error al cargar clientes</td></tr>`;

return;

}


tabla.innerHTML="";


data.forEach((cliente)=>{


tabla.innerHTML += `

<tr>

<td>${cliente.nombre}</td>

<td>${cliente.telefono || ""}</td>

<td>${cliente.fecha || ""}</td>

<td>
<span class="estado ${cliente.bloqueado ? 'Cancelado' : 'Confirmado'}">
${cliente.bloqueado ? '🔒 Bloqueado' : '✅ Activo'}
</span>
</td>

<td>

<button onclick="editarCliente('${cliente.id}')">
✏️ Editar
</button>


<button onclick="eliminarCliente('${cliente.id}')">
🗑️ Eliminar
</button>


<button onclick="toggleBloqueo('${cliente.id}', ${cliente.bloqueado})">
${cliente.bloqueado ? '🔓 Desbloquear' : '🔒 Bloquear'}
</button>


</td>


<td>

<button onclick="verFicha('${cliente.id}','${cliente.nombre.replace(/'/g,"\\'")}')">
👤 Ficha
</button>

</td>


</tr>

`;

});


}
mostrarClientes();



async function toggleBloqueo(id, estadoActual){


let { error } = await sbClient

.from("clientes")

.update({ bloqueado: !estadoActual })

.eq("id", id);


if(error){

alert("Error: " + error.message);

return;

}


mostrarClientes();


}



function verFicha(id, nombre){

localStorage.setItem("clienteActualId", id);

localStorage.setItem("clienteActual", nombre);


window.location="ficha.html";

}



async function eliminarCliente(id){

let confirmar = confirm(
"¿Seguro que querés eliminar este cliente?"
);


if(!confirmar) return;


let { error } = await sbClient

.from("clientes")

.delete()

.eq("id", id);


if(error){

alert("Error al eliminar: " + error.message);

return;

}


mostrarClientes();


}



async function editarCliente(id){


let { data, error } = await sbClient

.from("clientes")

.select("*")

.eq("id", id)

.single();


if(error || !data){

alert("No se pudo cargar el cliente");

return;

}


clienteEditarId = id;


document.getElementById("editarNombre").value = data.nombre;
document.getElementById("editarTelefono").value = data.telefono || "";
document.getElementById("editarServicio").value = data.servicio || "";
document.getElementById("editarNotas").value = data.notas || "";


document.getElementById("formEditar").style.display="block";


}



async function guardarEdicion(){


if(!clienteEditarId) return;


let nombre = document.getElementById("editarNombre").value;
let telefono = document.getElementById("editarTelefono").value;
let servicio = document.getElementById("editarServicio").value;
let notas = document.getElementById("editarNotas").value;


let { error } = await sbClient

.from("clientes")

.update({

nombre: nombre,
telefono: telefono,
servicio: servicio,
notas: notas

})

.eq("id", clienteEditarId);


if(error){

alert("Error al actualizar: " + error.message);

return;

}


document.getElementById("formEditar").style.display="none";

clienteEditarId = null;


mostrarClientes();


alert("Cliente actualizado");


}



function buscarCliente(){

let texto =
document.getElementById("buscador").value.toLowerCase();


let filas =
document.querySelectorAll("#tablaClientes tr");


filas.forEach(fila=>{


let contenido =
fila.innerText.toLowerCase();



if(contenido.includes(texto)){


fila.style.display="";


}else{


fila.style.display="none";


}


});


}
