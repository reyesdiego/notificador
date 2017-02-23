/**
 * Created by diego on 14/02/17.
 */

'use strict';

var mongoose = require('mongoose');

var notification = new mongoose.Schema({
    outgoingId: {type: mongoose.Schema.ObjectId, ref: 'alives'},
    incomingId: {type: mongoose.Schema.ObjectId, ref: 'incomings'},
    date: {type: Date, require: true},
    email: [{type: String}],
    message: {type: Object}
});

module.exports = mongoose.model('notifications', notification);
