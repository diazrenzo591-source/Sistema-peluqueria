let clienteId = localStorage.getItem("clienteActualId");

let nombre = localStorage.getItem("clienteActual");

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


}


cargarCliente();



let visitas = JSON.parse(
localStorage.getItem("visitas")
) || [];



function agregarVisita(){


let visita = {

cliente:nombre,

servicio:
document.getElementById("servicioVisita").value,

precio:
document.getElementById("precioVisita").value,

nota:
document.getElementById("notaVisita").value,

fecha:
new Date().toLocaleDateString()

};



visitas.push(visita);


localStorage.setItem(
"visitas",
JSON.stringify(visitas)
);


mostrarVisitas();


}



function mostrarVisitas(){


let lista = document.getElementById("listaVisitas");


if(!lista)return;


lista.innerHTML="";


visitas
.filter(v=>v.cliente==nombre)
.forEach(v=>{


lista.innerHTML += `

<div class="card">

<p>📅 ${v.fecha}</p>

<p>✂️ ${v.servicio}</p>

<p>💰 $${v.precio}</p>

<p>📝 ${v.nota}</p>

</div>

`;

});


}


mostrarVisitas();
let colores = JSON.parse(
localStorage.getItem("colores")
) || [];



function guardarColor(){


let color = {

cliente:nombre,

marca:
document.getElementById("marcaColor").value,

tono:
document.getElementById("tonoColor").value,

oxidante:
document.getElementById("oxidante").value,

tiempo:
document.getElementById("tiempoColor").value,

formula:
document.getElementById("formulaColor").value,

fecha:
new Date().toLocaleDateString()

};



colores.push(color);



localStorage.setItem(
"colores",
JSON.stringify(colores)
);



mostrarColores();


alert("Fórmula guardada");


}




function mostrarColores(){


let contenedor =
document.getElementById("historialColor");


if(!contenedor)return;


contenedor.innerHTML="";


colores
.filter(c=>c.cliente==nombre)
.forEach(c=>{


contenedor.innerHTML += `

<div class="card">

<p>📅 ${c.fecha}</p>

<p>🎨 ${c.marca} - ${c.tono}</p>

<p>🧪 ${c.oxidante}</p>

<p>⏱️ ${c.tiempo}</p>

<p>📝 ${c.formula}</p>

</div>

`;

});


}


mostrarColores();
function cargarFoto(event){

let archivo = event.target.files[0];


let lector = new FileReader();


lector.onload=function(){

localStorage.setItem(
"fotoCliente_"+nombre,
lector.result
);


document.getElementById("imagenCliente").src =
lector.result;


}


lector.readAsDataURL(archivo);


let foto = localStorage.getItem(
"fotoCliente_"+nombre
);


if(foto){

document.getElementById("imagenCliente").src = foto;

}
}
let fotos = JSON.parse(
localStorage.getItem("fotos_"+nombre)
) || [];



function agregarFotos(event){


let archivos = event.target.files;


for(let i=0;i<archivos.length;i++){


let lector = new FileReader();


lector.onload=function(){


fotos.push(lector.result);



localStorage.setItem(
"fotos_"+nombre,
JSON.stringify(fotos)
);



mostrarFotos();


}


lector.readAsDataURL(archivos[i]);


}


}



function mostrarFotos(){


let galeria =
document.getElementById("galeriaFotos");


if(!galeria)return;


galeria.innerHTML="";


fotos.forEach((foto,index)=>{


galeria.innerHTML += `

<div style="display:inline-block;margin:10px;">


<img 
src="${foto}"
onclick="verFoto('${foto}')"
style="
width:120px;
height:120px;
object-fit:cover;
border-radius:15px;
cursor:pointer;
">


<br>


<button onclick="eliminarFoto(${index})">

🗑️

</button>


</div>

`;

});


}



function eliminarFoto(index){


fotos.splice(index,1);



localStorage.setItem(
"fotos_"+nombre,
JSON.stringify(fotos)
);



mostrarFotos();


}



mostrarFotos();
function verFoto(foto){


document.getElementById("fotoGrande").src=foto;


document.getElementById("visorFoto").style.display="flex";


}



function cerrarFoto(){


document.getElementById("visorFoto").style.display="none";


}
let estilos = JSON.parse(
localStorage.getItem("estilos_"+nombre)
) || [];



function guardarEstilo(){


let estilo = {

corte:
document.getElementById("corteFavorito").value,

barba:
document.getElementById("barbaFavorita").value,

color:
document.getElementById("colorFavorito").value,

notas:
document.getElementById("estiloNotas").value,

fecha:
new Date().toLocaleDateString()

};



estilos.push(estilo);



localStorage.setItem(
"estilos_"+nombre,
JSON.stringify(estilos)
);



mostrarEstilos();


}



function mostrarEstilos(){


let contenedor =
document.getElementById("historialEstilos");


if(!contenedor)return;


contenedor.innerHTML="";



estilos.forEach(e=>{


contenedor.innerHTML += `

<div class="card">


<p>📅 ${e.fecha}</p>

<p>✂️ Corte: ${e.corte}</p>

<p>🧔 Barba: ${e.barba}</p>

<p>🎨 Color: ${e.color}</p>

<p>📝 ${e.notas}</p>


</div>

`;

});


}



mostrarEstilos();
