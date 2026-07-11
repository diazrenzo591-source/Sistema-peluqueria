let turnos = JSON.parse(
localStorage.getItem("turnos")
) || [];

let hoy = new Date().toISOString().split("T")[0];

let turnosHoy = turnos.filter(
t => t.fecha == hoy && t.estado != "Cancelado"
);

let agenda =
document.getElementById("agenda");


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


horas.forEach(hora=>{

let turno = turnosHoy.find(
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
