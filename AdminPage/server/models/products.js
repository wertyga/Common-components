import mongoose from 'mongoose';

const { Schema } = mongoose;
let models = {};

const ProductShema = () => {
    return new Schema({
        title: String,
        description: String,
        category: String,
        price: String,
        discount: String,
        filePath: String,
        index: Number
    });
};

models.frames = mongoose.model('frame', new ProductShema());
models.albums = mongoose.model('album', new ProductShema());


export default models;
