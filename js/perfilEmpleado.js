let nombre = localStorage.getItem("empleadoSeleccionado");

document.getElementById("nombreEmpleado").innerHTML = nombre;

let empleados =
JSON.parse(localStorage.getItem("empleados")) || [];

let turnos =
JSON.parse(localStorage.getItem("turnos")) || [];

let empleado =
empleados.find(e=>e.nombre==nombre);

if(empleado){

document.getElementById("especialidad").value =
empleado.especialidad || "";

document.getElementById("comisionEmpleado").innerHTML =
"$"+(empleado.ganancias || 0);

}

let atendidos =
turnos.filter(t=>

t.profesional==nombre &&
t.estado=="Finalizado"

);

document.getElementById("clientesAtendidos").innerHTML =
atendidos.length;

let total=0;

atendidos.forEach(t=>{

total += Number(t.precio);

});

document.getElementById("facturacionEmpleado").innerHTML =
"$"+total;

function guardarEspecialidad(){

empleado.especialidad =
document.getElementById("especialidad").value;

localStorage.setItem(
"empleados",
JSON.stringify(empleados)
);

alert("Especialidad guardada.");

}

function subirFotoEmpleado(event){

let archivo = event.target.files[0];

if(!archivo) return;

let lector = new FileReader();

lector.onload=function(){

empleado.foto = lector.result;

localStorage.setItem(
"empleados",
JSON.stringify(empleados)
);

document.getElementById("imagenEmpleado").src =
lector.result;

}

lector.readAsDataURL(archivo);

}

if(empleado && empleado.foto){

document.getElementById("imagenEmpleado").src =
empleado.foto;

}
