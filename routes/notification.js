/**
 * Created by diego on 14/02/17.
 */

'use strict';

var config = require('../config/config.js');
var moment = require('moment');

var notification = () => {

    var express = require('express');
    var router = express.Router();

    var Notification = require('../lib/notification.js');
    Notification = new Notification();

    let getNotifications = (req, res) => {

        var params = {};
        var options = {
            skip: req.params.skip,
            limit: req.params.limit
        };
        Notification.getAll(params, options)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };

    router.get('/:skip/:limit', getNotifications);

    return router;
};
module.exports = notification;
