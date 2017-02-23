/**
 * Created by diego on 28/04/16.
 */

module.exports = function (app, socket) {
    "use strict";

    let verifyToken = (req, res, next) => {
        var incomingToken = req.headers.token,
            token = require("../include/token.js");
        var result;

        var account = require("../lib/account.js");
        account = new account();

        token.verifyToken(incomingToken, (err, payload) => {
            if (err) {
                result = {
                    status: "ERROR",
                    message: "Token Inválido"
                };
                res.status(401).send(result);
            } else {
                account.getAccount(payload.email, payload.password)
                    .then(data => {
                        req.user = payload;
                        if (err) {
                        } else {
                            if (data.status === 'OK') {
                                req.user.data = data.data;
                            }
                            next();
                        }
                    })
                    .catch(err => {
                        res.status(500).send(err);
                    });
            }
        });
    };

    var account = require("./account.js")(socket);
    app.use('/', account);

    var incoming = require("./incoming.js")(socket);
    app.use('/incomings', verifyToken, incoming);

    var outgoing = require("./outgoing.js")(socket);
    app.use('/outgoings', verifyToken, outgoing);

    var notification = require("./notification.js")();
    app.use('/notifications', verifyToken, notification);

    app.get('/', (req, res) => {
        res.status(200).send("Notifica 1.0\n");
    });

};