let caja = JSON.parse(
localStorage.getItem("caja")
) || [];


let filtroActual = "todo";


function cambiarFiltro(){

filtroActual =
document.getElementById("filtroCaja").value;


let mostrarRango = filtroActual == "rango";


document.getElementById("fechaDesde").style.display =
mostrarRango ? "inline-block" : "none";

document.getElementById("fechaHasta").style.display =
mostrarRango ? "inline-block" : "none";

document.getElementById("btnFiltrarRango").style.display =
mostrarRango ? "inline-block" : "none";


if(!mostrarRango){

mostrarCaja();

}

}



function obtenerPagosFiltrados(){


let hoy = new Date();


let inicioSemana = new Date();

inicioSemana.setDate(
hoy.getDate() - hoy.getDay()
);

inicioSemana.setHours(0,0,0,0);



return caja.filter(pago=>{


let fechaPago = new Date(pago.fecha);



if(filtroActual=="hoy"){

return fechaPago.toDateString() == hoy.toDateString();

}


if(filtroActual=="semana"){

return fechaPago >= inicioSemana;

}


if(filtroActual=="mes"){

return (
fechaPago.getMonth() == hoy.getMonth() &&
fechaPago.getFullYear() == hoy.getFullYear()
);

}


if(filtroActual=="rango"){

let desde = document.getElementById("fechaDesde").value;
let hasta = document.getElementById("fechaHasta").value;


if(!desde || !hasta) return true;


let desdeFecha = new Date(desde+"T00:00:00");
let hastaFecha = new Date(hasta+"T23:59:59");


return fechaPago >= desdeFecha && fechaPago <= hastaFecha;

}


return true;


});


}



// Mostrar historial

function mostrarCaja(){

let tabla = document.getElementById("tablaCaja");


if(!tabla) return;


tabla.innerHTML="";


let pagosFiltrados = obtenerPagosFiltrados();


pagosFiltrados.forEach(pago=>{


tabla.innerHTML += `

<tr>

<td>${pago.cliente}</td>

<td>${pago.servicio}</td>

<td>$${pago.monto}</td>

<td>${pago.formaPago}</td>

<td>${new Date(pago.fecha).toLocaleDateString()}</td>

</tr>

`;

});


let totalFiltrado = pagosFiltrados.reduce(
(suma,pago)=> suma + Number(pago.monto), 0
);


document.getElementById("totalFiltrado").innerHTML =

pagosFiltrados.length == 0 ?
"Sin movimientos en este período" :
`${pagosFiltrados.length} movimiento(s) — Total: $${totalFiltrado}`;


mostrarFacturacionProfesionales(pagosFiltrados);


calcularTotales();


}



function mostrarFacturacionProfesionales(pagosFiltrados){


let tabla = document.getElementById("tablaProfesionales");


if(!tabla) return;


tabla.innerHTML="";


let resumen = {};


pagosFiltrados.forEach(pago=>{


let nombre = pago.profesional || "Sin asignar";


if(!resumen[nombre]){

resumen[nombre] = { cantidad:0, total:0 };

}


resumen[nombre].cantidad += 1;

resumen[nombre].total += Number(pago.monto);


});


let nombres = Object.keys(resumen).sort(
(a,b)=> resumen[b].total - resumen[a].total
);


if(nombres.length == 0){

tabla.innerHTML =
`<tr><td colspan="3">Sin datos en este período</td></tr>`;

return;

}


nombres.forEach(nombre=>{


tabla.innerHTML += `

<tr>

<td>${nombre}</td>

<td>${resumen[nombre].cantidad}</td>

<td>$${resumen[nombre].total}</td>

</tr>

`;

});


}




function calcularTotales(){


let hoy = new Date();


let totalHoy = 0;
let totalSemana = 0;
let totalMes = 0;


let hace7Dias = new Date();

hace7Dias.setDate(
hoy.getDate()-7
);



caja.forEach(pago=>{


let fechaPago = new Date(pago.fecha);


let monto = Number(pago.monto);



if(fechaPago.toDateString() == hoy.toDateString()){

totalHoy += monto;

}



if(fechaPago >= hace7Dias){

totalSemana += monto;

}



if(
fechaPago.getMonth() == hoy.getMonth()
&&
fechaPago.getFullYear() == hoy.getFullYear()

){

totalMes += monto;

}


});



document.getElementById("hoy").innerHTML =
"$"+totalHoy;


document.getElementById("semana").innerHTML =
"$"+totalSemana;


document.getElementById("mes").innerHTML =
"$"+totalMes;


}



mostrarCaja();
