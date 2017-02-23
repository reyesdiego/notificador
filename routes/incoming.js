/**
 * Created by diego on 14/02/17.
 */

'use strict';

var config = require('../config/config.js');
var moment = require('moment');

var incoming = (io) => {

    var express = require('express');
    var router = express.Router();

    var Incoming = require('../lib/incoming.js');
    Incoming = new Incoming();

    let getIncomings = (req, res) => {
        Incoming.getAll()
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };

    router.post('/incoming/:routeName', (req, res) => {
        var email = config.email;
        var Incoming = require('../lib/incoming.js');
        Incoming = new Incoming();
        var Notification = require('../lib/notification.js');
        Notification = new Notification();

        var fecha = moment().format('DD-MM-YYYY HH:mm:ss');

        Incoming.getByName(req.params.routeName)
            .then(data => {
                var incoming = data.data;
                if (incoming) {
                    var response = {
                        status: "OK",
                        name: incoming.name,
                        description: incoming.description,
                        type: incoming.type,
                        fecha: fecha
                    };
                    /** Convierte el mensaje en array si es que viene solo un objeto, luego envía los
                     *  socket.emit por cada uno de ellos */
                    var messages = req.body.message;
                    if (messages !== undefined) {
                        if (messages.length === undefined) {
                            messages = [messages];
                        }
                    }
                    response.emailSent = false;
                    if (incoming.mail.status) {
                        var Mail = require('../include/emailjs.js');
                        Mail = new Mail(email);
                        Mail.send(incoming.mail.accounts, incoming.name, JSON.stringify(req.body.message))
                            .then(data => {
                                messages.forEach(item => {
                                    response.emailSent = true;
                                    response.message = item;
                                    incoming.group.map(group => (io.in(group).emit('incoming', response)));
                                });
                                Notification.add({
                                    incomingId: incoming._id,
                                    date: new Date(),
                                    message: messages,
                                    email: incoming.mail.accounts
                                });
                                console.log("MAIL %s a %s", incoming.name, incoming.mail.accounts);
                            })
                            .catch(err => {
                                messages.forEach(item => {
                                    response.message = item;
                                    incoming.group.map(group => (io.in(group).emit('incoming', response)));
                                });
                                Notification.add({
                                    incomingId: incoming._id,
                                    date: new Date(),
                                    message: messages
                                });
                                console.error(err);
                            });
                    } else {
                        messages.forEach(item => {
                            response.message = item;
                            incoming.group.map(group => (io.in(group).emit('incoming', response)));
                        });
                        Notification.add({
                            incomingId: incoming._id,
                            date: new Date(),
                            message: messages
                        });
                    }
                    io.emit('isAlive', {status: "OK", name: incoming.name, fecha: fecha});
                    res.status(200).send(data);
                } else {
                    data.message = `No existe el Mensaje ${req.params.routeName}`;
                    res.status(200).send(data);
                }
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send(err);
            });
    });

    let add = (req, res) => {
        var incoming = req.body;
        Incoming.add(incoming)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };


    router.post('/incoming', add);
    router.get('/', getIncomings);

    return router;
};
module.exports = incoming;
