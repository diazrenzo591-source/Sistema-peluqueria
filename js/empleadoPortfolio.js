let empleadoId = localStorage.getItem("empleadoId");

let empleadoLocal = localStorage.getItem("empleadoLocal");



async function subirArchivo(archivo){


let nombreArchivo =
`${empleadoLocal}/${empleadoId}/${Date.now()}-${archivo.name}`;


let { error } = await sbClient.storage

.from("trabajos")

.upload(nombreArchivo, archivo);


if(error) throw error;


let { data } = sbClient.storage

.from("trabajos")

.getPublicUrl(nombreArchivo);


return data.publicUrl;


}



async function subirTrabajo(){


let tipo = document.getElementById("tipoTrabajo").value;

let archivoAntes = document.getElementById("archivoAntes").files[0];

let archivoDespues = document.getElementById("archivoDespues").files[0];

let descripcion = document.getElementById("descripcionTrabajo").value;


if(!archivoDespues){

alert("Subí al menos la foto o video del resultado");

return;

}


let estado = document.getElementById("estadoSubida");

estado.innerHTML = "Subiendo...";


try{


let urlAntes = null;


if(archivoAntes){

urlAntes = await subirArchivo(archivoAntes);

}


let urlDespues = await subirArchivo(archivoDespues);


let { error } = await sbClient

.from("trabajos")

.insert({

codigo_local: empleadoLocal,
empleado_id: empleadoId,
tipo: tipo,
url_antes: urlAntes,
url_despues: urlDespues,
descripcion: descripcion

});


if(error){

alert("Error al guardar: " + error.message);

estado.innerHTML = "";

return;

}


document.getElementById("archivoAntes").value = "";
document.getElementById("archivoDespues").value = "";
document.getElementById("descripcionTrabajo").value = "";

estado.innerHTML = "";


mostrarTrabajos();


}catch(error){

alert("Error al subir el archivo: " + error.message);

estado.innerHTML = "";

}


}



async function mostrarTrabajos(){


let contenedor = document.getElementById("galeriaTrabajos");

if(!contenedor) return;


let { data, error } = await sbClient

.from("trabajos")

.select("*")

.eq("empleado_id", empleadoId)

.order("fecha", { ascending:false });


if(error){

console.error(error);

return;

}


contenedor.innerHTML = "";


if(data.length==0){

contenedor.innerHTML = `<div class="card"><p>Todavía no subiste ningún trabajo.</p></div>`;

return;

}


data.forEach(t=>{


let mediaDespues = t.tipo=="video"

? `<video src="${t.url_despues}" controls style="width:100%;border-radius:10px;"></video>`

: `<img src="${t.url_despues}" style="width:100%;border-radius:10px;">`;


let bloqueAntes = t.url_antes

? `<div style="flex:1;"><p>Antes</p><img src="${t.url_antes}" style="width:100%;border-radius:10px;"></div>
<div style="flex:1;"><p>Después</p>${mediaDespues}</div>`

: mediaDespues;


contenedor.innerHTML += `

<div class="card" style="margin-bottom:15px;">

<div style="display:flex;gap:10px;">
${bloqueAntes}
</div>

<p>${t.descripcion || ""}</p>

<button onclick="eliminarTrabajo('${t.id}')">🗑️ Eliminar</button>

</div>

`;

});


}



async function eliminarTrabajo(id){


let confirmar = confirm("¿Eliminar este trabajo del portfolio?");

if(!confirmar) return;


let { error } = await sbClient

.from("trabajos")

.delete()

.eq("id", id);


if(error){

alert("Error al eliminar: " + error.message);

return;

}


mostrarTrabajos();


}



mostrarTrabajos();
