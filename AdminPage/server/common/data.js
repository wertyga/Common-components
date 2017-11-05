import models from '../models/products';

const productsCategory = [
    {
        title: 'Рамки',
        value: 'frames',
        model: models.frames
    },
    {
        title: "Альбомы",
        value: 'albums',
        model: models.albums
    },
    {
        title: "Все",
        value: 'all'
    }
];

export default productsCategory;