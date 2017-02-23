/**
 * Created by diego on 20/01/17.
 */
/**
 * Created by diego on 7/31/14.
 */

'use strict';
/**
 * Método que chequea el estado de una página o servicio web.
 * @module isAlive
 *
 * @param {Object} options - Objeto options.
 * @param {String} options.url - URL de la página o servicio a chequear
 * @param {Number} options.port - Puerto.
 * @param {String} options.path - Ruta de la página o servicio a chequear.
 * @param {String} options.method - Método WEB.
 * @param {Object} options.headers - Header, propiedad-valor de headers.
 * @api public

 * */
module.exports.isAlive = (options) => {
    return new Promise((resolve, reject) => {
        var http = require('http');

        var optionsget = {
            host: options.url, // here only the domain name (no http/https !)
            port: options.port,
            path: options.path,
            method: options.method,
            timeout: 20
        };
        if (options.headers !== undefined) {
            optionsget.headers = options.headers;
        } else {
            delete options.headers;
        }

        var reqGet;

        reqGet = http.request(optionsget, (res) => {
            var chunk1 = '';
            res.on('data', chunk => {
                chunk1 += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 302) {
                    resolve({
                        status: "OK",
                        statusCode: res.statusCode,
                        data: chunk1
                    });
                } else {
                    reject({
                        status: "ERROR",
                        statusCode: res.statusCode,
                        data: chunk1
                    });
                }
            });
        });

        reqGet.end();

        reqGet.on('error', (err) => {
            reject({
                status: err.code,
                data: err
            });
            reqGet.end();
        });
    });
};
