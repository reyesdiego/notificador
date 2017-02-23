/**
 * Created by diego on 16/02/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
    email: {type: String, required: true, lowercase: true, index: { unique: true } },
    password: {type: String, required: true},
    groups: [{type: String, required: true}],
    lastname: {type: String, required: true},
    firstname: {type: String, required: true},
    dateCreated: {type: Date, required: true, default: Date.now},
    status: {type: Number, required: true}
});

module.exports = mongoose.model('accounts', Account);