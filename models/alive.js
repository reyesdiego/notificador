/**
 * Created by diego on 23/01/17.
 */

'use strict';

var mongoose = require('mongoose');

var alive = new mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String},
    req: {
        url: {type: String, require: true},
        port: {type: Number, require: true},
        path: {type: String},
        method: {type: String},
        headers: {type: Object}
    },
    res: {
        status: {type: String},
        description: {type: String},
        config: {
            date: {type: String},
            description: [{type: String}]
        }
    },
    type: {type: String, require: true, enum: ["ERROR", "WARN", "INFO"]},
    mail: {
        status: {type: Boolean},
        period: {type: String},
        count: {type: Number},
        accounts: [{type: String}]
    },
    cron: {
        second: {type: Number},
        minute: {type: Number},
        hour: {type: Number},
        day: {type: Number},
        month: {type: Number},
        dayOfWeek: [{type: Number}]
    },
    group: [{type: String}],
    status: {type: Boolean, default: false}
});

module.exports = mongoose.model('alives', alive);