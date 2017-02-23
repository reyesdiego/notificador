/**
 * Created by diego on 23/01/17.
 */

module.exports = (url, options) => {
    'use strict';
    var mongoose = require('mongoose');

    if (options) {
        mongoose.connect(url, options);
    } else {
        mongoose.connect(url);
    }

    mongoose.connection.on('connected', () => {
        //log.logger.info("Mongoose %s Connected to Database. %s", mongoose.version, url);
        console.log("Mongoose %s Connected to Database. %s", mongoose.version, url);
    });

    mongoose.connection.on('error', err => {
        //log.logger.error("Database or Mongoose error. %s", err.stack);
        console.error("Database or Mongoose error. %s", err.stack);
    });
    mongoose.connection.on('disconnected', () => {
        //log.logger.error("Mongoose default connection disconnected, el proceso %s se abortará", process.pid);
        console.error("Mongoose default connection disconnected, el proceso %s se abortará", process.pid);
        process.exit();
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            //log.logger.info("Mongoose default connection disconnected through app termination");
            console.info("Mongoose default connection disconnected through app termination");
            process.exit();
        });
    });

};
