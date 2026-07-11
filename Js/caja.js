let caja = JSON.parse(
localStorage.getItem("caja")
) || [];


// Mostrar historial

function mostrarCaja(){

let tabla = document.getElementById("tablaCaja");


if(!tabla) return;


tabla.innerHTML="";


caja.forEach(pago=>{


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


calcularTotales();


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
