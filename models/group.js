/**
 * Created by diego on 23/01/17.
 */

'use strict';

var mongoose = require('mongoose');

var group = new mongoose.Schema({
    _id: {type: String, require: true},
    description: {type: String, require: true},
    status: {type: Boolean, require: true}
});

module.exports = mongoose.model('groups', group);