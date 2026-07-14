let empleadoId = localStorage.getItem("empleadoId");

let empleadoActual = null;



async function cargarPerfil(){


let { data, error } = await sbClient

.from("empleados")

.select("*")

.eq("id", empleadoId)

.single();


if(error || !data){

alert("No se pudo cargar tu perfil");

return;

}


empleadoActual = data;


document.getElementById("nombreEmpleado").innerHTML = data.nombre;

document.getElementById("especialidad").value = data.especialidad || "";

document.getElementById("dni").value = data.dni || "";

document.getElementById("experiencia").value = data.experiencia || "";

document.getElementById("comisionEmpleado").innerHTML =
"$"+(data.ganancias || 0);


if(data.foto){

document.getElementById("imagenEmpleado").src = data.foto;

}


calcularEstadisticas(data.nombre);


}



function calcularEstadisticas(nombreEmpleado){


// Los turnos todavía viven en localStorage del local (los migramos después)

let turnos = JSON.parse(localStorage.getItem("turnos")) || [];


let atendidos = turnos.filter(t=>

t.profesional==nombreEmpleado &&
t.estado=="Finalizado"

);


document.getElementById("clientesAtendidos").innerHTML = atendidos.length;


let total=0;

atendidos.forEach(t=>{

total += Number(t.precio);

});


document.getElementById("facturacionEmpleado").innerHTML = "$"+total;


}



async function guardarPerfil(){


if(!empleadoActual) return;


let especialidad = document.getElementById("especialidad").value;
let dni = document.getElementById("dni").value;
let experiencia = document.getElementById("experiencia").value;


let { error } = await sbClient

.from("empleados")

.update({

especialidad: especialidad,
dni: dni,
experiencia: experiencia

})

.eq("id", empleadoActual.id);


if(error){

alert("Error al guardar: " + error.message);

return;

}


alert("Perfil actualizado");


}



function subirFotoEmpleado(event){


let archivo = event.target.files[0];

if(!archivo) return;


let lector = new FileReader();


lector.onload = async function(){


let fotoBase64 = lector.result;


let { error } = await sbClient

.from("empleados")

.update({ foto: fotoBase64 })

.eq("id", empleadoActual.id);


if(error){

alert("Error al subir la foto: " + error.message);

return;

}


document.getElementById("imagenEmpleado").src = fotoBase64;


}


lector.readAsDataURL(archivo);


}



cargarPerfil();
