/**
 * Created by diego on 23/01/17.
 */

'use strict';

class Incoming {
    constructor () {
        this.model = require('../models/incoming.js');
    }

    add (incoming) {
        return new Promise((resolve, reject) => {
            this.model.create(incoming)
                .then(data => {
                    resolve({
                        status: 'OK',
                        data: data
                    });
                })
                .catch(err => {
                    reject({
                        status: 'ERROR',
                        message: err.message,
                        data: err
                    });
                });
        });
    }

    change (incoming) {
        return new Promise((resolve, reject) => {
            var _id = incoming._id;
            this.model.update({_id: _id}, {
                $set: {
                    description: incoming.description,
                    name: incoming.name,
                    type: incoming.type,
                    group: incoming.group,
                    mail: incoming.mail
                }
            })
            .exec((err, data) =>{
                    if (err) {
                        reject({
                            status: "ERROR",
                            message: err.message,
                            data: err
                        });
                    } else {
                        resolve({
                            status: "OK",
                            data: data
                        });
                    }
                });

        });
    }

    remove (name) {
        return new Promise((resolve, reject) => {
            this.model.remove({name: name})
                .then(data => {
                    resolve({
                        status: 'OK',
                        data: data
                    });
                })
                .catch(err => {
                    reject({
                        status: 'ERROR',
                        message: err.message,
                        data: err
                    });
                });
        });
    }

    getAll () {
        return new Promise((resolve, reject) => {
            this.model.find()
                .lean()
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

    getByName (routeName) {
        return new Promise((resolve, reject) => {
            this.model.find({name: routeName})
                .lean()
                .exec()
                .then((data) => {
                    resolve({
                        status: "OK",
                        data: data[0] || null
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

}

module.exports = Incoming;