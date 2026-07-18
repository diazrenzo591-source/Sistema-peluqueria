let codigoLocal = localStorage.getItem("codigoLocal");



async function cargarDashboard(){


let hoy = new Date().toISOString().split("T")[0];


// Turnos de hoy

let { data: turnosHoy, error: errorTurnos } = await sbClient

.from("turnos")

.select("*")

.eq("codigo_local", codigoLocal)

.eq("fecha", hoy);


if(errorTurnos) console.error(errorTurnos);


document.getElementById("turnosHoy").innerHTML =
(turnosHoy || []).length;



// Ingresos totales (caja)

let { data: pagos, error: errorPagos } = await sbClient

.from("caja")

.select("monto")

.eq("codigo_local", codigoLocal);


if(errorPagos) console.error(errorPagos);


let total = 0;

(pagos || []).forEach(p=>{ total += Number(p.monto); });


document.getElementById("ingresos").innerHTML = "$"+total;



// Clientes

let { count: clientesTotal } = await sbClient

.from("clientes")

.select("*", { count:"exact", head:true })

.eq("codigo_local", codigoLocal);


document.getElementById("clientesTotal").innerHTML = clientesTotal || 0;



// Empleados

let { count: empleadosTotal } = await sbClient

.from("empleados")

.select("*", { count:"exact", head:true })

.eq("codigo_local", codigoLocal);


document.getElementById("empleadosTotal").innerHTML = empleadosTotal || 0;



// Próximos turnos de hoy

let tablaProximos = document.getElementById("proximosTurnos");


if(tablaProximos){


let proximos = (turnosHoy || [])

.filter(t=>t.estado!="Cancelado")

.sort((a,b)=> a.hora.localeCompare(b.hora));


if(proximos.length==0){

tablaProximos.innerHTML =
`<tr><td colspan="4">No hay turnos para hoy</td></tr>`;

}else{

tablaProximos.innerHTML = proximos.map(t=>`

<tr>
<td>${t.hora}</td>
<td>${t.cliente}</td>
<td>${t.servicio}</td>
<td>${t.profesional}</td>
</tr>

`).join("");

}

}



// Servicios más vendidos (turnos finalizados)

let contenedorTop = document.getElementById("serviciosTop");


if(contenedorTop){


let { data: finalizados, error: errorFinalizados } = await sbClient

.from("turnos")

.select("servicio")

.eq("codigo_local", codigoLocal)

.eq("estado", "Finalizado");


if(errorFinalizados) console.error(errorFinalizados);


let conteo = {};


(finalizados || []).forEach(t=>{

conteo[t.servicio] = (conteo[t.servicio] || 0) + 1;

});


let ranking = Object.entries(conteo)

.sort((a,b)=> b[1]-a[1])

.slice(0,3);


if(ranking.length==0){

contenedorTop.innerHTML = "<p>Sin datos todavía</p>";

}else{

let medallas = ["🥇","🥈","🥉"];

contenedorTop.innerHTML = ranking

.map((item,index)=> `<p>${medallas[index]} ${item[0]} - ${item[1]} ventas</p>`)

.join("");

}

}


}


cargarDashboard();


// Link de reserva para compartir con clientes

let urlReserva =
window.location.origin +
window.location.pathname.replace("dashboard.html","") +
"reservar.html?local=" + codigoLocal;

let campoLink = document.getElementById("linkReserva");

if(campoLink){

campoLink.value = urlReserva;

}


function copiarLinkReserva(){

let valor = document.getElementById("linkReserva").value;


navigator.clipboard.writeText(valor).then(function(){

alert("Link copiado");

}).catch(function(){

alert("No se pudo copiar automáticamente. Copialo a mano: " + valor);

});

}



// Exportar backup directo desde Supabase

async function exportarBackup(){


try{


let tablas = ["empleados","turnos","caja","clientes","servicios"];


let backup = { codigoLocal: codigoLocal, datos: {} };


for(let tabla of tablas){


let { data, error } = await sbClient

.from(tabla)

.select("*")

.eq("codigo_local", codigoLocal);


if(error) throw error;


backup.datos[tabla] = data;


}


let contenido = JSON.stringify(backup);

let blob = new Blob([contenido], { type:"application/json" });

let url = URL.createObjectURL(blob);


let link = document.createElement("a");

link.href = url;

link.download =
"backup-"+codigoLocal+"-"+new Date().toISOString().split("T")[0]+".json";

link.click();


URL.revokeObjectURL(url);


}catch(error){

alert("Error al generar el backup: " + error.message);

}


}



// Restaurar backup directo en Supabase

function importarBackup(event){


let archivo = event.target.files[0];

if(!archivo) return;


let lector = new FileReader();


lector.onload = async function(){


try{


let backup = JSON.parse(lector.result);


if(!backup.datos){

alert("El archivo no tiene el formato esperado.");

return;

}


let confirmar = confirm(
"Esto va a BORRAR los datos actuales de este local en la base y reemplazarlos por los del backup. ¿Continuar?"
);


if(!confirmar) return;


let tablas = ["empleados","turnos","caja","clientes","servicios"];


for(let tabla of tablas){


await sbClient

.from(tabla)

.delete()

.eq("codigo_local", codigoLocal);


let filas = backup.datos[tabla];


if(filas && filas.length > 0){


let { error } = await sbClient

.from(tabla)

.insert(filas);


if(error) throw error;


}


}


alert("Backup restaurado correctamente.");


location.reload();


}catch(error){

alert("Error al restaurar el backup: " + error.message);

}


}


lector.readAsText(archivo);


}
