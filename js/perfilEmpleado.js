let empleadoId = localStorage.getItem("empleadoSeleccionado");

let empleadoActual = null;



async function cargarPerfil(){


let { data, error } = await sbClient

.from("empleados")

.select("*")

.eq("id", empleadoId)

.single();


if(error || !data){

alert("No se pudo cargar el perfil del empleado");

return;

}


empleadoActual = data;


document.getElementById("nombreEmpleado").innerHTML = data.nombre;

document.getElementById("especialidad").value = data.especialidad || "";

document.getElementById("comisionEmpleado").innerHTML =
"$"+(data.ganancias || 0);


if(data.foto){

document.getElementById("imagenEmpleado").src = data.foto;

}


calcularEstadisticas(data.nombre, data.codigo_local);


}



async function calcularEstadisticas(nombreEmpleado, codigoLocal){


let { data: turnos, error } = await sbClient

.from("turnos")

.select("*")

.eq("codigo_local", codigoLocal)

.eq("profesional", nombreEmpleado)

.eq("estado", "Finalizado");


if(error){

console.error(error);

return;

}


document.getElementById("clientesAtendidos").innerHTML = turnos.length;


let total=0;

turnos.forEach(t=>{

total += Number(t.precio);

});


document.getElementById("facturacionEmpleado").innerHTML = "$"+total;


}



async function guardarEspecialidad(){


if(!empleadoActual) return;


let especialidad = document.getElementById("especialidad").value;


let { error } = await sbClient

.from("empleados")

.update({ especialidad: especialidad })

.eq("id", empleadoActual.id);


if(error){

alert("Error al guardar: " + error.message);

return;

}


empleadoActual.especialidad = especialidad;


alert("Especialidad guardada.");


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
