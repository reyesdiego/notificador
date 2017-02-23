/**
 * Created by diego on 23/01/17.
 */

'use strict';

var mongoose = require('mongoose');

var incoming = new mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String, require: true},
    type: {type: String, require: true, enum: ["ERROR", "WARN", "INFO"]},
    mail: {
        status: {type: Boolean},
        accounts: [{type: String}]
    },
    data: [
        {
            date: {type: Date},
            name: {type: String},
            description: {type: String},
            type: {type: String}
        }
    ]
});

module.exports = mongoose.model('incomings', incoming);