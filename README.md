# Notificaciones
Monitoreo de Servicios

Hay dos tipos de monitoreos, uno por eventos y otro por checkeo programado con fechas y/o horarios.

## Login

Para utilizar los métodos del Servicio se debe obtener un Token, el mismo se obtiene con un Usuario y Clave predefinidos.

**URL** : http://localhost:port/login
**METHOD**: 'POST'
**HEADER**: 
    Content-Type: application/json
**DATA**: { email: "dreyes@puertobuenosaires.gob.ar", "password": "123456"}

**RESPONSE**: { 
                status: "OK", 
                data: {
                        token: "vfa09sbjaofiduv9a8jfdvoajdf9vjadfv"
                }
              }

### Eventos

**URL** : http://localhost:port/incoming/:eventName
**METHOD**: 'POST'
**HEADER**: 
    Content-Type: "application/json",
    token: "vfa09sbjaofiduv9a8jfdvoajdf9vjadfv"
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
**RESPONSE**: {
                status:"OK",
                data: {
                        _id: "58b087c6335e847f932c35cc",
                        incomingId: "588b40f11ea4b3cd1249aeff",
                        date: "2017-02-24T19:21:42.098Z",
                        message: [
                                { description: "Funcionando el metodo uno",
                                  date: "2017-02-24"
                                },
                                { description: "Barco estancado",
                                  date: "2017-02-24"
                                }],
                        email: [ "dreyes@puertobuenosaires.gob.ar"]
                       }
                }
Si **response** contiene la propiedad email significa haber enviado email correctamente a los destinatarios incluidos en el array.


Programado

El sistema consulta mediante http una URL en donde chequea lo que se quiere monitorear. Dicha llamada retorna dos tipos de estados http, 200 y cualquier otro.
Cuando devuelve 200 significa que lo que se quiere monitorear está sano y el sistema de monitoreo no emite ningún alerta, solo emite un evento indicando que el 
chequeo se realizó con éxito.
Se dá de alta la tarea programada hacia la URL a chequear con los siguientes parámetros.

