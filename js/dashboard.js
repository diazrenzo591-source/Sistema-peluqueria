let turnos =
JSON.parse(localStorage.getItem("turnos")) || [];


let clientes =
JSON.parse(localStorage.getItem("clientes")) || [];


let empleados =
JSON.parse(localStorage.getItem("empleados")) || [];


let caja =
JSON.parse(localStorage.getItem("caja")) || [];


let hoy = new Date().toISOString().split("T")[0];

let turnosHoy = turnos.filter(
t => t.fecha == hoy
);

document.getElementById("turnosHoy").innerHTML =
turnosHoy.length;


let total=0;

caja.forEach(p=>{

total += Number(p.monto);

});


document.getElementById("ingresos").innerHTML =
"$"+total;



document.getElementById("clientesTotal").innerHTML =
clientes.length;



document.getElementById("empleadosTotal").innerHTML =
empleados.length;



// Próximos turnos de hoy, ordenados por hora

let tablaProximos =
document.getElementById("proximosTurnos");


if(tablaProximos){

tablaProximos.innerHTML="";


let proximos = turnosHoy
.filter(t=>t.estado!="Cancelado")
.sort((a,b)=> a.hora.localeCompare(b.hora));


if(proximos.length==0){

tablaProximos.innerHTML =
`<tr><td colspan="4">No hay turnos para hoy</td></tr>`;

}else{

proximos.forEach(t=>{

tablaProximos.innerHTML += `

<tr>
<td>${t.hora}</td>
<td>${t.cliente}</td>
<td>${t.servicio}</td>
<td>${t.profesional}</td>
</tr>

`;

});

}

}



// Servicios más vendidos según turnos finalizados

let contenedorTop =
document.getElementById("serviciosTop");


if(contenedorTop){

let finalizados = turnos.filter(
t=>t.estado=="Finalizado"
);


let conteo = {};

finalizados.forEach(t=>{

conteo[t.servicio] =
(conteo[t.servicio] || 0) + 1;

});


let ranking = Object.entries(conteo)
.sort((a,b)=> b[1]-a[1])
.slice(0,3);


if(ranking.length==0){

contenedorTop.innerHTML =
"<p>Sin datos todavía</p>";

}else{

let medallas = ["🥇","🥈","🥉"];

contenedorTop.innerHTML = ranking
.map((item,index)=>

`<p>${medallas[index]} ${item[0]} - ${item[1]} ventas</p>`

).join("");

}

}



// Exportar todos los datos guardados en un archivo .json

function exportarBackup(){

let backup = {};


for(let i=0;i<localStorage.length;i++){

let clave = localStorage.key(i);

if(clave=="sesion") continue;

backup[clave] = localStorage.getItem(clave);

}


let contenido = JSON.stringify(backup);

let blob = new Blob([contenido], {type:"application/json"});

let url = URL.createObjectURL(blob);


let link = document.createElement("a");

link.href = url;

link.download =
"backup-salonmind-"+new Date().toISOString().split("T")[0]+".json";

link.click();

URL.revokeObjectURL(url);

}



// Restaurar datos desde un archivo .json exportado antes

function importarBackup(event){

let archivo = event.target.files[0];

if(!archivo) return;


let lector = new FileReader();


lector.onload = function(){

try{

let datos = JSON.parse(lector.result);


let confirmar = confirm(
"Esto va a reemplazar todos los datos actuales por los del backup. ¿Continuar?"
);


if(!confirmar) return;


Object.keys(datos).forEach(clave=>{

localStorage.setItem(clave, datos[clave]);

});


alert("Backup restaurado correctamente. La página se va a recargar.");

location.reload();


}catch(error){

alert("El archivo elegido no es un backup válido.");

}

}


lector.readAsText(archivo);

}
