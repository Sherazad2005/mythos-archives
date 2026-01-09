const mongoose = require('mongoose');

function getMongoUri() {
    return process.env.MONGODB_URI;
}

function ensureMongoUriExists(uri) {
    if (!uri) {
        throw new Error('MONGODB_URI manquante dans le fichier .env');
    }
}

function getMongoOptions() {
    return {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
}

function loginSucceed() {
    console.log(' MongoDB connecté (lore-service)');
}

async function connectDB() {
    try {
        const uri = getMongoUri();

        doesMongoUriExist(uri);

        const options = getMongoOptions();

        await mongoose.connect(uri, options);

        loginSucceed();

    }
    catch(error) {
        handleConnectError(error);

    }
}

moodule.exports = connectDB;