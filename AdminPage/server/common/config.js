import path from 'path';

export default {
    PORT: 3000,
    mongoose: {
        uri: 'mongodb://localhost/admin',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    },
    session: {
        secret: "nodeJSForever",
        key: "sid",
        cookie: {
            httpOnly: true,
            maxAge: 3600000
        }
    },
    hash: {
        secret: 'boooom!',
        salt: 10
    },
    uploads: {
        directory: 'productsImages',
        destination: path.join(__dirname, '../', 'productsImages')
    }
}