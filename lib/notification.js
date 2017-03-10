/**
 * Created by diego on 14/02/17.
 */

'use strict';

class Notification {
    constructor () {
        this.model = require('../models/notification.js');
    }

    add (notification) {
        return new Promise((resolve, reject) => {
            this.model.create(notification)
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

    getAll (params, options) {
        return new Promise((resolve, reject) => {
            var param = {};
            if (params.group) {
                param.$or = [{'incoming.group': params.group},{'outgoing.group': params.group}];
            }
            this.model.aggregate(
                [ { "$lookup": {
                    "from": "incomings",
                    "localField": "incomingId",
                    "foreignField": "_id",
                    "as": "incoming"
                }},
                    { "$lookup": {
                        "from": "alives",
                        "localField": "outgoingId",
                        "foreignField": "_id",
                        "as": "outgoing"
                    }},
                    {$match: param},
                    {$skip: parseInt(options.skip)},
                    {$limit: parseInt(options.limit)}
                ])
                .exec()
                .then(data => {

                    this.model.aggregate(
                        [ { "$lookup": {
                            "from": "incomings",
                            "localField": "incomingId",
                            "foreignField": "_id",
                            "as": "incoming"
                        }},
                            { "$lookup": {
                                "from": "alives",
                                "localField": "outgoingId",
                                "foreignField": "_id",
                                "as": "outgoing"
                            }},
                            {$match: param},
                            {$group: {
                                _id: '',
                                total: {$sum: 1}
                            }}
                        ])
                        .exec()
                        .then(totalData => {
                            var totalCount = 0;
                            if (totalData !==undefined && totalData.length > 0) {
                                totalCount = totalData[0].total;
                            }
                            resolve({
                                status: "OK",
                                totalCount: totalCount,
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

module.exports = Notification;