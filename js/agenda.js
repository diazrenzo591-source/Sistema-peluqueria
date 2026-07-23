let codigoLocal = localStorage.getItem("codigoLocal");

let hoy = new Date().toISOString().split("T")[0];

let agenda = document.getElementById("agenda");



function minutosDesdeMedianoche(hora){

let partes = hora.split(":");

return Number(partes[0])*60 + Number(partes[1]);

}


function minutosAHora(minutos){

let h = Math.floor(minutos/60);

let m = minutos%60;

return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0");

}



async function cargarAgenda(){


let { data, error } = await sbClient

.from("turnos")

.select("*")

.eq("codigo_local", codigoLocal)

.eq("fecha", hoy)

.neq("estado", "Cancelado")

.order("hora", { ascending:true });


if(error){

console.error(error);

agenda.innerHTML = "<p>No se pudo cargar la agenda</p>";

return;

}


if(data.length==0){

agenda.innerHTML = `

<div class="card">

<p>No hay turnos cargados para hoy</p>

</div>

`;

return;

}


agenda.innerHTML = "";


data.forEach(turno=>{


let inicio = minutosDesdeMedianoche(turno.hora);

let fin = inicio + Number(turno.duracion || 30);

let horaFin = minutosAHora(fin);


agenda.innerHTML += `

<div class="card">

<h2>${turno.hora} — ${horaFin}</h2>

<p>👤 ${turno.cliente}</p>

<p>✂️ ${turno.servicio}</p>

<p>👨‍💼 ${turno.profesional}</p>

<p class="estado ${turno.estado}">
${turno.estado}
</p>

</div>

`;

});


}


cargarAgenda();
