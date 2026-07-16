// Protección de sesión del portal de empleados

if(localStorage.getItem("empleadoSesion") != "activa"){

window.location = "empleado-login.html";

}


function logoutEmpleado(){

localStorage.removeItem("empleadoSesion");

localStorage.removeItem("empleadoId");

localStorage.removeItem("empleadoLocal");

window.location = "empleado-login.html";

}
