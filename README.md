# Notificaciones
Monitoreo de Servicios

Hay dos tipos de monitoreos, uno por eventos y otro por esquema de checkeo de manera programada con horarios.

### Login

**URL** : http://localhost:port/login

**METHOD**: 'POST'

**HEADER**: 
    Content-Type: application/json

**DATA**: 
    {"email": "mmoran@puertobuenosaires.gob.ar", "password": "123456"}
	
**RESPONSE**: 
    {
        "status": "OK",
        "data": {
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1tb3JhbkBwdWVydG9idWVub3NhaXJlcy5nb2IuYXIiLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTQ4ODU0NTc0OCwiZXhwIjoxNDg4NjMyMTQ4fQ.N2TiJPhE4OKSKorLkkEdwnMSu3KIMoDqRFH3bS0oQEE"
            }
    }


### Eventos


**URL** : http://localhost:port/incoming/:eventName

**METHOD**: 'POST'

**HEADER**: 
    Content-Type: application/json
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1tb3JhbkBwdWVydG9idWVub3NhaXJlcy5nb2IuYXIiLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTQ4ODU0NTc0OCwiZXhwIjoxNDg4NjMyMTQ4fQ.N2TiJPhE4OKSKorLkkEdwnMSu3KIMoDqRFH3bS0oQEE" 

**DATA**: 
        {
                message: [
                        {date: "2017/11/11", description: "Giro Vencido | Buque TITANIC"},
                        {date: "2017/11/18", description: "Giro Vencido | Buque MAERKS LETONIA"}
                        ]
        }
        ó
        {
                message: {date: "2017/11/11", description: "Giro Vencido | Buque TITANIC"}
        }


### Programado

El sistema consulta mediante http una URL en donde chequea lo que se quiere monitorear. Dicha llamada retorna dos tipos de estados http, 200 y cualquier otro.
Cuando devuelve 200 significa que lo que se quiere monitorear está sano y el sistema de monitoreo no emite ningún alerta, solo emite un evento indicando que el 
chequeo se realizó con éxito.
Se dá de alta la tarea programada hacia la URL a chequear con los siguientes parámetros.

