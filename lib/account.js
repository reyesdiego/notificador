/**
 * Created by diego on 16/02/17.
 * @module Account
 */
'use strict';

class Account {
    constructor () {
        this.model = require("../models/account");
        this.groups = require("../models/group");
    }

    getAccount (user, password) {
        return new Promise((resolve, reject) => {
            this.model.findOne({email: user})
                .lean()
                .exec((err, dataAccount) => {
                    if (err) {
                        reject({
                            status: "ERROR",
                            message: err.message,
                            data: err
                        });
                    } else {
                        if (!dataAccount) {
                            reject({
                                status: "ERROR",
                                message: "El usuario no existe",
                                data: {email: user}
                            });
                        } else {
                            if (dataAccount.password !== password) {
                                reject({
                                    status: "ERROR",
                                        message: "Clave incorrecta",
                                    data: {email: user, password: password}
                                });
                            } else {
                                resolve({status: "OK", data: dataAccount });
                            }
                        }
                    }
                });
        });
    }

    getGroups () {
        return new Promise((resolve, reject) => {

            this.groups.find()
                .exec()
                .then(data => {
                    resolve({
                        status: "OK",
                        data: data
                    });
                })
                .catch(err => {
                    reject({
                        status: "ERROR",
                        message: err.message,
                        data: err
                    });
                });
        });
    }

    /**
     * @return {String}
     * */
    toString () {
        return "Account object";
    }
}

module.exports = Account;
