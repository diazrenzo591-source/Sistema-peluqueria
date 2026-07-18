let clienteId = localStorage.getItem("clienteActualId");

let nombre = localStorage.getItem("clienteActual");

let codigoLocal = localStorage.getItem("codigoLocal");

let cliente = null;



async function cargarCliente(){


let { data, error } = await sbClient

.from("clientes")

.select("*")

.eq("id", clienteId)

.single();


if(error || !data){

console.error(error);

return;

}


cliente = data;


document.getElementById("nombreCliente").innerHTML =
cliente.nombre;


document.getElementById("telefono").innerHTML =
cliente.telefono || "";


document.getElementById("servicio").innerHTML =
cliente.servicio || "";


document.getElementById("notas").innerHTML =
cliente.notas || "";


mostrarVisitas();

mostrarColores();

mostrarEstilos();

mostrarFotos();


}


cargarCliente();



// Visitas

async function agregarVisita(){


let visita = {

codigo_local: codigoLocal,
cliente_id: clienteId,

servicio:
document.getElementById("servicioVisita").value,

precio:
document.getElementById("precioVisita").value,

nota:
document.getElementById("notaVisita").value

};


let { error } = await sbClient

.from("visitas")

.insert(visita);


if(error){

alert("Error al guardar la visita: " + error.message);

return;

}


document.getElementById("servicioVisita").value = "";
document.getElementById("precioVisita").value = "";
document.getElementById("notaVisita").value = "";


mostrarVisitas();


}



async function mostrarVisitas(){


let lista = document.getElementById("listaVisitas");


if(!lista)return;


let { data, error } = await sbClient

.from("visitas")

.select("*")

.eq("cliente_id", clienteId)

.order("fecha", { ascending:false });


if(error){

console.error(error);

return;

}


lista.innerHTML="";


data.forEach(v=>{


lista.innerHTML += `

<div class="card">

<p>📅 ${new Date(v.fecha).toLocaleDateString()}</p>

<p>✂️ ${v.servicio}</p>

<p>💰 $${v.precio}</p>

<p>📝 ${v.nota || ""}</p>

</div>

`;

});


}



// Colorimetría

async function guardarColor(){


let color = {

codigo_local: codigoLocal,
cliente_id: clienteId,

marca:
document.getElementById("marcaColor").value,

tono:
document.getElementById("tonoColor").value,

oxidante:
document.getElementById("oxidante").value,

tiempo:
document.getElementById("tiempoColor").value,

formula:
document.getElementById("formulaColor").value

};


let { error } = await sbClient

.from("colores")

.insert(color);


if(error){

alert("Error al guardar: " + error.message);

return;

}


mostrarColores();


alert("Fórmula guardada");


}




async function mostrarColores(){


let contenedor =
document.getElementById("historialColor");


if(!contenedor)return;


let { data, error } = await sbClient

.from("colores")

.select("*")

.eq("cliente_id", clienteId)

.order("fecha", { ascending:false });


if(error){

console.error(error);

return;

}


contenedor.innerHTML="";


data.forEach(c=>{


contenedor.innerHTML += `

<div class="card">

<p>📅 ${new Date(c.fecha).toLocaleDateString()}</p>

<p>🎨 ${c.marca} - ${c.tono}</p>

<p>🧪 ${c.oxidante}</p>

<p>⏱️ ${c.tiempo}</p>

<p>📝 ${c.formula}</p>

</div>

`;

});


}



// Galería de fotos

function agregarFotos(event){


let archivos = event.target.files;


for(let i=0;i<archivos.length;i++){


let lector = new FileReader();


lector.onload = async function(){


let { error } = await sbClient

.from("fotos_cliente")

.insert({

codigo_local: codigoLocal,
cliente_id: clienteId,
foto: lector.result

});


if(error){

alert("Error al subir la foto: " + error.message);

return;

}


mostrarFotos();


}


lector.readAsDataURL(archivos[i]);


}


}



async function mostrarFotos(){


let galeria =
document.getElementById("galeriaFotos");


if(!galeria)return;


let { data, error } = await sbClient

.from("fotos_cliente")

.select("*")

.eq("cliente_id", clienteId)

.order("fecha", { ascending:false });


if(error){

console.error(error);

return;

}


galeria.innerHTML="";


data.forEach((foto)=>{


galeria.innerHTML += `

<div style="display:inline-block;margin:10px;">


<img 
src="${foto.foto}"
onclick="verFoto('${foto.foto.replace(/'/g,"\\'")}')"
style="
width:120px;
height:120px;
object-fit:cover;
border-radius:15px;
cursor:pointer;
">


<br>


<button onclick="eliminarFoto('${foto.id}')">

🗑️

</button>


</div>

`;

});


}



async function eliminarFoto(id){


let { error } = await sbClient

.from("fotos_cliente")

.delete()

.eq("id", id);


if(error){

alert("Error al eliminar: " + error.message);

return;

}


mostrarFotos();


}



function verFoto(foto){


document.getElementById("fotoGrande").src=foto;


document.getElementById("visorFoto").style.display="flex";


}



function cerrarFoto(){


document.getElementById("visorFoto").style.display="none";


}



// Estilos favoritos

async function guardarEstilo(){


let estilo = {

codigo_local: codigoLocal,
cliente_id: clienteId,

corte:
document.getElementById("corteFavorito").value,

barba:
document.getElementById("barbaFavorita").value,

color:
document.getElementById("colorFavorito").value,

notas:
document.getElementById("estiloNotas").value

};


let { error } = await sbClient

.from("estilos")

.insert(estilo);


if(error){

alert("Error al guardar: " + error.message);

return;

}


mostrarEstilos();


}



async function mostrarEstilos(){


let contenedor =
document.getElementById("historialEstilos");


if(!contenedor)return;


let { data, error } = await sbClient

.from("estilos")

.select("*")

.eq("cliente_id", clienteId)

.order("fecha", { ascending:false });


if(error){

console.error(error);

return;

}


contenedor.innerHTML="";


data.forEach(e=>{


contenedor.innerHTML += `

<div class="card">


<p>📅 ${new Date(e.fecha).toLocaleDateString()}</p>

<p>✂️ Corte: ${e.corte}</p>

<p>🧔 Barba: ${e.barba}</p>

<p>🎨 Color: ${e.color}</p>

<p>📝 ${e.notas}</p>


</div>

`;

});


}
