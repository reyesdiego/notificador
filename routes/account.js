/**
 * Created by diego on 16/02/17.
 * @module Account
 */

module.exports = () => {
    "use strict";

    var express = require('express');
    var router = express.Router();

    var Account = require("../lib/account.js");
    Account = new Account();

    var login = (req, res) => {
        var token = require("../include/token.js");
        var payload = req.body;
        var response;
        var result;


        if (payload.email === undefined || payload.password === '') {
            result = {
                status: "ERROR",
                message: "Debe ingresar un Usuario"
            };
            res.status(403).send(result);
        } else {

            Account.getAccount(payload.email, payload.password)
                .then(data => {
                    let user = data.data;
                    if (user.status === true) {
                        token.createToken(payload)
                            .then(token => {
                                user.token = token;
                                response = {
                                    status: "OK",
                                    data: user
                                };
                                res.status(200).send(response);
                            })
                            .catch(err => {
                                res.status(403).send({
                                    status: "ERROR",
                                    message: "Hubo un error en el inicio de sesión (token)",
                                    data: err
                                });
                            });
                    } else {
                        res.status(403).send({
                            status: "ERROR",
                            message: `El usuario no se encuentra habilitado para operar.`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        }
    };

    var getGroups = (req, res) => {
        Account.getGroups()
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };

    router.post("/login", login);
    router.get("/groups", getGroups);

    return router;
};
