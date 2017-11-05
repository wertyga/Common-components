import express from 'express';
import webpack from 'webpack';
import webpackConfig from '../webpack.dev.config';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import path from 'path';
import cluster from 'cluster';
import http from 'http';

import config from './common/config';
const log = require('./common/log')(module);
import mongoose from './common/mongoose';
import sessionStore from './common/sessionStore';

import admin from './routes/admin';

const dev = true;

const app = express();

if (dev ? false : cluster.isMaster) {

    let cpuCount = require('os').cpus().length;

    for (let i = 0; i < cpuCount; i += 1) {
        cluster.schedulingPolicy = cluster.SCHED_NONE;
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });

} else {

    const server = http.createServer(app);

    //****************** Webpack ********************
    if(dev) {

        const compiler = webpack(webpackConfig);

        app.use(webpackMiddleware(compiler, {
            hot: true,
            publicPath: webpackConfig.output.publicPath,
            noInfo: true
        }));
        app.use(webpackHotMiddleware(compiler));
    }

    //**********************************************

    app.use(bodyParser.json());
    app.use(cookieParser());
    // app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, config.uploads.directory)));
    app.use(session({
        secret: config.session.secret,
        saveUninitialized: false,
        resave: true,
        key: config.session.key,
        cookie: config.session.cookie,
        store: sessionStore
    }));

    //************************* GARBAGE magic ***********************************

    if(!dev) {
        let gcInterval;

        function init() {
            gcInterval = setInterval(function () {
                gcDo();
            }, 60000);
        };

        function gcDo() {
            global.gc();
            clearInterval(gcInterval);
            init();
        };

        init();
    }

    //************************************************************

    //******************************** Routes ***************************

    app.use('/admin', admin);

    // app.get('/*', (req, res) => {
    //     // req.session.destroy();
    //     res.sendFile(path.join(__dirname, 'adminPage.html'))
    // });

    // app.get('*', (req, res) => {
    //     res.status(404).sendFile(path.join(__dirname, '404', '404.html'));
    // });

    //******************************** Run server ***************************

    app.listen(config.PORT, () => console.log(`Server run on ${config.PORT} port`));
};

//******************************** Uncaught Exception ***************************

process.on('uncaughtException', function (err) {
    log.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    log.error(err.stack);
    process.exit(1);
});






