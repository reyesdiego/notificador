/**
 * Created by diego on 23/01/17.
 */

'use strict';

class Alive {
    constructor () {
        this.model = require('../models/alive.js');
    }

    add (aliveJob) {
        return new Promise((resolve, reject) => {
            this.model.create(aliveJob)
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

    update (aliveJob) {
        return new Promise((resolve, reject) => {
            this.model.findOne({name: aliveJob.name})
                .exec()
                .then(data => {
                    if (aliveJob.description !== undefined) {
                        data.description = aliveJob.description;
                    }
                    if (aliveJob.type !== undefined) {
                        data.type = aliveJob.type;
                    }
                    if (aliveJob.status !== undefined) {
                        data.status = aliveJob.status;
                    }
                    if (aliveJob.group !== undefined) {
                        data.group = aliveJob.group;
                    }
                    if (aliveJob.cron !== undefined) {
                        data.cron = aliveJob.cron;
                    }
                    if (aliveJob.req !== undefined) {
                        if (aliveJob.req.url !== undefined) {
                            data.req.url = aliveJob.req.url;
                        }
                        if (aliveJob.req.port !== undefined) {
                            data.req.port = aliveJob.req.port;
                        }
                        if (aliveJob.req.path !== undefined) {
                            data.req.path = aliveJob.req.path;
                        }
                    }
                    if (aliveJob.res !== undefined) {
                        if (aliveJob.res.status !== undefined) {
                            data.res.status = aliveJob.res.status;
                        }
                        if (aliveJob.res.description !== undefined) {
                            data.res.description = aliveJob.res.description;
                        }
                    }
                    if (aliveJob.mail !== undefined) {
                        if (aliveJob.mail.status !== undefined) {
                            data.mail.status = aliveJob.mail.status;
                        }
                        if (aliveJob.mail.accounts !== undefined) {
                            data.mail.accounts = aliveJob.mail.accounts;
                        }
                    }
                    data.save((err, dataSaved) => {
                        if (err) {
                            reject({
                                status: "ERROR",
                                message: err.message,
                                data: err
                            });
                        } else {
                            resolve({
                                status: "OK",
                                data: dataSaved
                            });
                        }
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

    delete (id) {
        return new Promise((resolve, reject) => {
            this.model.remove({_id: id}, (err, data) => {
                if (err) {
                    reject({
                        status: 'ERROR',
                        message: err.message,
                        data: err
                    });
                } else {
                    resolve({
                        status: 'OK',
                        data: data
                    });
                }
            });
        });
    }

    getByName (name) {
        return new Promise((resolve, reject) => {
            this.model.find({name: name})
                .lean()
                .exec()
                .then(data => {
                    resolve({
                        status: "OK",
                        data: data[0]
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
}

module.exports = Alive;