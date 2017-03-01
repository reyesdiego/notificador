/**
 * Created by diego on 20/01/17.
 */

'use strict';

var config = require('./config/config.js');
var express = require('express');
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

require('./mongoose.js')(config.mongo.url, config.mongo.options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(express.static(__dirname + '/build'));
//app.use(express.static(__dirname + '/Script'));


app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'X-Requested-With, Content-Type, token');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Request-Headers', 'Content-Type, token');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    if ('OPTIONS' === req.method) {
        res.status(200).send();
    } else {
        next();
    }
});
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

var server = http.createServer(app);
server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.warn('El puerto %s está siendo utilizado por otro proceso. El proceso que intenta iniciar se abortará', config.serverPort);
        process.exit();
    }
});
var io = require('socket.io')(server);
io.sockets.on('connection', socket => {
    console.log('Socket recibe conexion. Esperando autenticación...');
    socket.auth = false;

    socket.on('authenticate', data => {
        var token = require("./include/token.js");
        if (data.token !== undefined) {
            token.verifyToken(data.token, (err, data) => {
                if (!err && data) {
                    socket.auth = true;
                } else {
                    socket.disconnect('Token Inválido');
                }
            });
        }
    });
    socket.on('room', room => {
        if (!socket.auth) {
            socket.disconnect('No Autenticado');
        } else {
            console.log('Server recieved a connection on %s', room);
            socket.join(room);
        }
    });
    socket.on('disconnect', () => {
        console.log('Usuario se desconectó');
    });
});

require('./routes/router.js')(app, io);


server.listen(config.serverPort, () => {
    console.info("#%s Nodejs %s Running on %s://localhost:%s", process.pid, process.version, 'http', config.serverPort);
});


process.on('uncaughtException', err => {
    console.error("Caught exception: " + err);
});
