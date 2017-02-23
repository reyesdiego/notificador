/**
 * Created by diego on 16/02/17.
 * @module Token
 */

'use strict';

var jwt = require("jsonwebtoken");
var secret = require("../config/secret.js");
var config = require("../config/config.js");

let createToken = (payload, options = {expiresIn: "1 day"}) => {
    return new Promise((resolve, reject) => {
        console.log(payload)
        jwt.sign(payload, secret, {expiresIn: options.expiresIn}, (token) => {
            resolve(token);
        });
    });
};

module.exports.createToken = createToken;

/**
 * Verifica token
 *
 * @param {string} token - Token.
 * @param {function} callback - return Function
 */
let verifyToken = (token, callback) => {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            callback(err);
        } else {
            callback(undefined, decoded);
        }
    });
};

module.exports.verifyToken = verifyToken;