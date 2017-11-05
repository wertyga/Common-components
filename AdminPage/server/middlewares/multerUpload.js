import path from 'path';
import fs from 'fs';

import config from '../common/config';
import log from '../common/log';

import Models from '../common/data';

export default function (req, res, next) {
    const { productId } = req.body;
    const filePath = `${req.file ? req.file.filename : req.body.image}`;

    if(!productId) {
        saveNewProduct({...req.body, filePath}, res)
    } else {
        editProduct({...req.body, filePath}, res)
    }
};

function saveNewProduct(opt, res) {
    const model = Models.find(item => item.value === opt.category);

    new model.model({...opt}).save((err, product) => {
        if(err) {
            res.status(500).json({ errors: err.message })
        } else {
            res.json({ product })
        }
    })
};

function editProduct(opt, res) {
    let Model = Models.find(item => item.value === opt.oldCategory);

    Model.model.findById(opt.productId, (err, product) => {
        if(err) {
            res.status(500).json({ errors: err.message })
        } else if(opt.category !== product.category) {
            saveNewProduct(opt, res);
            if(product.filePath !== opt.filePath) deleteImage(product);
            deleteProduct(product);
        } else {
            Model.model.findByIdAndUpdate(opt.productId, {...opt}, { new: true }, (err, result) => {
                if(err) {
                    res.status(500).json({ errors: err.message })
                } else {
                    if(product.filePath !== opt.filePath) deleteImage(product);
                    res.json({ product: result })
                }
            });
        }
    })
};

function deleteProduct(product) {
    try {
        product.remove();
    } catch(err) {
        log.error(err.message);
    }
};
function deleteImage(product) {
    if(!product.filePath) return;
    fs.unlink(path.join(config.uploads.destination, product.filePath), err => {
        if(err) {
            log.error(err.message) ;
            return;
        }
    });
};

export function deleteDoc(req, res, next) {
    const {id, category} = req.body.data;

    let Model = Models.find(item => item.value === category);
    Model.model.findById(id, (err, result) => {
        if(err) {
            log.error(err.message);
            res.status(500).json({ errors: err.message })
        } else {
            deleteImage(result);
            deleteProduct(result);
            res.end();
        }
    })
};