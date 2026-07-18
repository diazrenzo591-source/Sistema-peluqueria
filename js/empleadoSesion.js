// Protección de sesión del portal de empleados usando Supabase Auth real

(async function(){

let { data } = await sbClient.auth.getSession();


if(!data.session){

window.location = "empleado-login.html";

}


})();



async function logoutEmpleado(){

await sbClient.auth.signOut();

localStorage.removeItem("empleadoId");

localStorage.removeItem("empleadoLocal");

window.location = "empleado-login.html";

}
