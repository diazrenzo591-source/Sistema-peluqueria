self.addEventListener('push', function(event){

let datos = {};

try{

datos = event.data ? event.data.json() : {};

}catch(e){

datos = {
title: 'SalonMind',
body: event.data ? event.data.text() : 'Tenés una notificación nueva'
};

}

let titulo = datos.title || 'SalonMind';

let opciones = {
body: datos.body || 'Tenés un turno nuevo',
icon: datos.icon || undefined
};

event.waitUntil(self.registration.showNotification(titulo, opciones));

});


self.addEventListener('notificationclick', function(event){

event.notification.close();

event.waitUntil(

clients.matchAll({ type: 'window' }).then(function(listaVentanas){

for(let i=0;i<listaVentanas.length;i++){

if('focus' in listaVentanas[i]){

return listaVentanas[i].focus();

}

}

if(clients.openWindow){

return clients.openWindow('empleado-agenda.html');

}

})

);

});
