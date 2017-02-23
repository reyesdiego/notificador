/**
 * Created by diego on 14/02/17.
 */

'use strict';

var config = require('../config/config.js');
var moment = require('moment');
var schedule = require('node-schedule');
var Alive = require('../lib/alive.js');
Alive = new Alive();

let isAliveJob = (jobOptions, io) => {
    var email = config.email;
    var isAlive = require('../isAlive.js');
    var Notification = require('../lib/notification.js');
    Notification = new Notification();
    var scheduledFiredTime = moment().format('DD-MM-YYYY HH:mm:ss');
    var response, messages;

    var options = {
        url: jobOptions.req.url,
        port: parseInt(jobOptions.req.port),
        path: jobOptions.req.path,
        method: jobOptions.req.method,
        headers: jobOptions.req.headers
    };

    isAlive.isAlive(options)
        .then(data => {
            io.emit('isAlive', {status: "OK", name: jobOptions.name, fecha: scheduledFiredTime});
        })
        .catch(err => {
            var scheduledJob = schedule.scheduledJobs[jobOptions.name];

            io.emit('isAlive', {status: "ERROR", name: jobOptions.name, fecha: scheduledFiredTime});

            if (err.status === 'ECONNREFUSED' || err.status === 'ETIMEDOUT') {
                messages = [{description: JSON.stringify(err)}];
                response = {
                    status: "ERROR",
                    fecha: scheduledFiredTime,
                    name: jobOptions.name,
                    type: jobOptions.type,
                    description: "No se a podido conectar con el recurso",
                    message: "",
                    data: JSON.stringify(err),
                    nextInvocation: moment(scheduledJob.nextInvocation()).format('DD-MM-YYYY HH:mm:ss')
                };
                Notification.add({
                    outgoingId: jobOptions._id,
                    date: new Date(),
                    message: messages
                });

            } else {
                response = {
                    status: "ERROR",
                    fecha: scheduledFiredTime,
                    name: jobOptions.name,
                    type: jobOptions.type,
                    description: jobOptions.res.description,
                    data: JSON.stringify(err),
                    nextInvocation: moment(scheduledJob.nextInvocation()).format('DD-MM-YYYY HH:mm:ss')
                };
                var config = jobOptions.res.config;

                if (err.data !== undefined) {
                    messages = [];
                    let dataIsAlive = JSON.parse(err.data);
                    if (typeof dataIsAlive === 'object') {
                        let dataOfdata = dataIsAlive.data || dataIsAlive;
                        if (dataOfdata.length === undefined) {
                            messages.push(dataOfdata);
                        } else {
                            messages = dataOfdata;
                        }
                        if (config) {
                            messages.forEach(item => {
                                let message = {description: ''};
                                let properties = config.description;
                                properties.forEach(property => {
                                    message.description += item[property.trim()] + ' | ';
                                });
                            });
                        }
                    }
                }
            }

            if (scheduledJob.triggeredJobs() <= jobOptions.mail.count) {
                if (jobOptions.mail.status) {
                    var Mail = require('../include/emailjs.js');
                    Mail = new Mail(email);
                    Mail.send(jobOptions.mail.accounts, jobOptions.name, JSON.stringify(err))
                        .then(data => {
                            messages.forEach(item => {
                                response.emailSent = true;
                                response.message = item;
                                jobOptions.group.map(group => (io.in(group).emit('outgoing', response)));
                            });
                            Notification.add({
                                outgoingId: jobOptions._id,
                                date: new Date(),
                                message: messages,
                                email: jobOptions.mail.accounts
                            });
                            console.log("MAIL %s, %s", jobOptions.name, jobOptions.mail.accounts);
                        })
                        .catch(err => {
                            messages.forEach(item => {
                                response.message = item;
                                jobOptions.group.map(group => (io.in(group).emit('outgoing', response)));
                            });
                            Notification.add({
                                outgoingId: jobOptions._id,
                                date: new Date(),
                                message: messages
                            });
                            console.info(err);
                        });
                }
            } else {
                messages.forEach(item => {
                    //console.log(jobOptions.group)
                    response.message = item;
                    jobOptions.group.map(group => (io.in(group).emit('outgoing', response)));
                });
                Notification.add({
                    outgoingId: jobOptions._id,
                    date: new Date(),
                    message: messages
                });
            }

            if (jobOptions.datetime < moment()) {
                jobOptions.datetime = jobOptions.datetime.add(1, jobOptions.mail.period);
                scheduledJob.setTriggeredJobs(0);
            }
        });
};

var outgoing = (io) => {

    var express = require('express');
    var router = express.Router();

    router.get('/', (req, res) => {
        Alive.getAll()
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

    router.put('/outgoing/:name/change', (req, res) => {
        var aliveJobUpdated = req.body;

        Alive.getByName(req.params.name)
            .then(data => {
                var aliveJob = data.data;
                if (aliveJob === undefined) {
                    res.status(500).send({
                        status: "ERROR",
                        message: "No existe dicho servicio"
                    });
                } else {
                    Alive.update(aliveJobUpdated)
                        .then(data => {
                            var aliveChanged = data.data;
                            var scheduledJob = schedule.scheduledJobs[req.params.name];
                            if (scheduledJob) {
                                scheduledJob.cancel();
                            }
                            if (aliveChanged.status) {
                                let rule = {};
                                if (aliveChanged.cron.dayOfWeek) {
                                    rule.dayOfWeek = aliveChanged.cron.dayOfWeek;
                                }
                                if (aliveChanged.cron.second) {
                                    rule.second = new schedule.Range(0, 59, aliveChanged.cron.second);
                                }
                                if (aliveChanged.cron.minute) {
                                    rule.second = aliveChanged.cron.second || 0;
                                    rule.minute = new schedule.Range(0, 59, aliveChanged.cron.minute);
                                }
                                if (aliveChanged.cron.hour) {
                                    rule.second = aliveChanged.cron.second || 0;
                                    rule.minute = aliveChanged.cron.minute || 0;
                                    rule.hour = new schedule.Range(0, 23, aliveChanged.cron.hour);
                                }
                                if (aliveChanged.cron.day) {
                                    rule.second = 0;
                                    rule.minute = aliveChanged.cron.minute || 0;
                                    rule.hour = aliveChanged.cron.hour || 0;
                                    rule.day = new schedule.Range(0, 31, aliveChanged.cron.day);
                                }
                                if (aliveChanged.cron.month) {
                                    rule.month = new schedule.Range(0, 31, aliveChanged.cron.month);
                                }
                                schedule.scheduleJob(aliveChanged.name, rule, isAliveJob.bind(null, aliveChanged, io));
                            }
                            res.status(200).send(data);
                        })
                        .catch(err => {
                            res.status(500).send(err);
                        });
                }
            })
            .catch(err => {
                res.status(500).send(err);
            });

    });

    router.post('/outgoing', (req, res) => {
        var outgoing = req.body;
        Alive.add(outgoing)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

    router.delete('/outgoing', (req, res) => {
        var _id = req.query._id;
        Alive.delete(_id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

    Alive.getAll()
        .then(data => {
            var aliveJobs = data.data;
            aliveJobs.forEach(aliveJob => {
                if (aliveJob.status) {
                    aliveJob.datetime = moment().add(1, aliveJob.mail.period);
                    let rule = {};
                    if (aliveJob.cron.dayOfWeek) {
                        rule.dayOfWeek = aliveJob.cron.dayOfWeek;
                    }
                    if (aliveJob.cron.second) {
                        rule.second = new schedule.Range(0, 59, aliveJob.cron.second);
                    }
                    if (aliveJob.cron.minute) {
                        rule.second = aliveJob.cron.second || 0;
                        rule.minute = new schedule.Range(0, 59, aliveJob.cron.minute);
                    }
                    if (aliveJob.cron.hour) {
                        rule.second = aliveJob.cron.second || 0;
                        rule.minute = aliveJob.cron.minute || 0;
                        rule.hour = new schedule.Range(0, 23, aliveJob.cron.hour);
                    }
                    if (aliveJob.cron.day) {
                        rule.second = 0;
                        rule.minute = aliveJob.cron.minute || 0;
                        rule.hour = aliveJob.cron.hour || 0;
                        rule.day = new schedule.Range(0, 31, aliveJob.cron.day);
                    }
                    if (aliveJob.cron.month) {
                        rule.month = new schedule.Range(0, 31, aliveJob.cron.month);
                    }
                    schedule.scheduleJob(aliveJob.name, rule, isAliveJob.bind(null, aliveJob, io));
                }
            });
        })
        .catch(err => {
            console.error(err);
        });

    return router;
};

module.exports = outgoing;
