let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

let indiceEditar = null;


function mostrarFormulario(){

let formulario = document.getElementById("formulario");


if(formulario.style.display=="block"){

formulario.style.display="none";


}else{


formulario.style.display="block";


// Limpiar formulario

document.getElementById("nombre").value="";
document.getElementById("telefono").value="";
document.getElementById("fecha").value="";
document.getElementById("servicio").value="";
document.getElementById("notas").value="";


}

}



function guardarCliente(){


let nombre = document.getElementById("nombre").value;
let telefono = document.getElementById("telefono").value;
let fecha = document.getElementById("fecha").value;
let servicio = document.getElementById("servicio").value;
let notas = document.getElementById("notas").value;



if(nombre==""){

alert("Ingresá un nombre");

return;

}



clientes.push({

nombre,
telefono,
fecha,
servicio,
notas

});

localStorage.setItem(
"clientes",
JSON.stringify(clientes)
);

mostrarClientes();

mostrarFormulario();


alert("Cliente agregado");


}



function mostrarClientes(){

let tabla = document.getElementById("tablaClientes");

if(!tabla) return;

tabla.innerHTML="";


clientes.forEach((cliente,index)=>{


tabla.innerHTML += `

<tr>

<td>${cliente.nombre}</td>

<td>${cliente.telefono}</td>

<td>${cliente.fecha}</td>

<td>
<span class="estado ${cliente.bloqueado ? 'Cancelado' : 'Confirmado'}">
${cliente.bloqueado ? '🔒 Bloqueado' : '✅ Activo'}
</span>
</td>

<td>

<button onclick="editarCliente(${index})">
✏️ Editar
</button>


<button onclick="eliminarCliente(${index})">
🗑️ Eliminar
</button>


<button onclick="toggleBloqueo(${index})">
${cliente.bloqueado ? '🔓 Desbloquear' : '🔒 Bloquear'}
</button>


</td>


<td>

<button onclick="verFicha('${cliente.nombre}')">
👤 Ficha
</button>

</td>


</tr>

`;

});


}
mostrarClientes();


function toggleBloqueo(index){

clientes[index].bloqueado = !clientes[index].bloqueado;

localStorage.setItem(
"clientes",
JSON.stringify(clientes)
);

mostrarClientes();

}


function verFicha(nombre){

localStorage.setItem(
"clienteActual",
nombre
);


window.location="ficha.html";

}


function eliminarCliente(index){

let confirmar = confirm(
"¿Seguro que querés eliminar este cliente?"
);


if(confirmar){

clientes.splice(index,1);


localStorage.setItem(
"clientes",
JSON.stringify(clientes)
);


mostrarClientes();

}

}



function editarCliente(index){

indiceEditar = index;

let cliente = clientes[index];


document.getElementById("editarNombre").value = cliente.nombre;
document.getElementById("editarTelefono").value = cliente.telefono;
document.getElementById("editarServicio").value = cliente.servicio;
document.getElementById("editarNotas").value = cliente.notas;


document.getElementById("formEditar").style.display="block";


}



function guardarEdicion(){

if(indiceEditar===null) return;


let cliente = clientes[indiceEditar];


cliente.nombre = document.getElementById("editarNombre").value;
cliente.telefono = document.getElementById("editarTelefono").value;
cliente.servicio = document.getElementById("editarServicio").value;
cliente.notas = document.getElementById("editarNotas").value;


localStorage.setItem(
"clientes",
JSON.stringify(clientes)
);


document.getElementById("formEditar").style.display="none";

indiceEditar = null;


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
