import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import shortid from 'shortid';

import bcrypt from 'bcrypt';
import config from '../common/config';
import sessionStore from '../common/sessionStore';
import log from '../common/log';

import Admin from '../models/Admin';

import adminAuth from '../middlewares/adminAuth';
import validation from '../middlewares/validation';
import multerUpload from '../middlewares/multerUpload';
import { deleteDoc } from '../middlewares/multerUpload';

import categories from '../common/data';

const route = express.Router();

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.stat(config.uploads.destination, (err, stats) => {
            if(err) {
                if(err.code === 'ENOENT') {
                    try {
                        fs.mkdirSync(config.uploads.destination);
                        cb(null, config.uploads.destination)
                    } catch(err) {
                        log.error(err.message);
                        res.status(500).json({ errors: err.message });
                    }
                };
            } else {
                cb(null, config.uploads.destination);
            }
        });
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const uploads = multer({
    storage: multerStorage,
    fileFilter: function(req, file, cb) {
        if(file.mimetype.split('/')[0] !== 'image') {
            cb(null, false)
        } else {
            cb(null, true)
        }
    },
    limits: {
        fileSize: 10**7
    }
});

route.get('/', adminAuth, (req, res) => res.sendFile(path.join(__dirname, '..', 'adminPage.html')));

route.post('/api/login', (req, res) => {
    // bcrypt.hash('qwe', config.hash.salt, (err, hash) => console.log(hash));
    const { isValid, errors } = validation(req.body);
    const { name, password } = req.body;
    
    if(!isValid) {
        res.status(400).json({ errors });
    } else {
        Admin.findOne({ name }, (err, user) => {
            if(err) {
                res.status(500).json({ errors: err.message });
            } else if(!user) {
                res.status(400).json({ errors: { name: 'No such user' } });
            } else {
                bcrypt.compare(password, user.hashPassword, (err, pas) => {
                    if(err) {
                        log.error(err.message);
                        res.status(400).json({ errors: err.message });
                    } else if(!pas) {
                        res.status(400).json({ errors: { password: 'Password not correct' } });
                    } else {
                        try {
                            req.session.isAdmin = true;
                            req.session.save();
                            res.json({ user })
                        } catch(err) {
                            log.error(err.message);
                            res.status(500).json({ errors: err.message })
                        }
                    }
                });
            }
        });
    }
});

route.get('/fetch-categories', (req, res) => {
    res.json({ categories: categories.map(item => { return { value: item.value, title: item.title } }) })
});

route.get('/get-category/:value', (req, res) => {
    if(req.params.value === 'all') {
        let promiseArr = [];

        categories.forEach(item => {
            if(item.model) {
                promiseArr.push(item.model.find({}))
            }
        });
        Promise.all(promiseArr)
            .then(reslv => {
                let products = [];
                reslv.forEach(prod => {
                    products.push(...prod);
                });
                res.json({ products })
            })
            .catch(err => console.log(err))
    } else {
        const productModel = categories.find(item => item.value === req.params.value);
        productModel.model.find({}, (err, products) => {
            if (err) {
                log.error(err.message);
                res.status(500).json({errors: err.message});
            } else {
                res.json({products})
            }
        });
    }
});

route.post('/edit-product', uploads.single('image'), multerUpload, (req, res) => {});

route.post('/delete-product', deleteDoc, (req, res) => {});

route.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'adminPage.html'))
});



export default route;