let codigoLocal = localStorage.getItem("codigoLocal");

let hoy = new Date().toISOString().split("T")[0];

let agenda = document.getElementById("agenda");


let horas = [

"09:00",
"10:00",
"11:00",
"12:00",
"13:00",
"14:00",
"15:00",
"16:00",
"17:00",
"18:00",
"19:00",
"20:00"

];



async function cargarAgenda(){


let { data, error } = await sbClient

.from("turnos")

.select("*")

.eq("codigo_local", codigoLocal)

.eq("fecha", hoy)

.neq("estado", "Cancelado");


if(error){

console.error(error);

agenda.innerHTML = "<p>No se pudo cargar la agenda</p>";

return;

}


horas.forEach(hora=>{

let turno = data.find(
t=>t.hora==hora
);


if(turno){

agenda.innerHTML += `

<div class="card">

<h2>${hora}</h2>

<p>👤 ${turno.cliente}</p>

<p>✂️ ${turno.servicio}</p>

<p>👨‍💼 ${turno.profesional}</p>

<p class="estado ${turno.estado}">
${turno.estado}
</p>

</div>

`;

}else{

agenda.innerHTML += `

<div class="card">

<h2>${hora}</h2>

<p>Disponible</p>

</div>

`;

}

});


}


cargarAgenda();
