const mongoose = require('mongoose');

function getMongoUri() {
    return process.env.MONGODB_URI;
}

function ensureMongoUriExists(uri) {
    if (!uri) {
        throw new Error('MONGODB_URI manquante dans le fichier .env');
    }
}


function loginSucceed() {
    console.log(' MongoDB connecté (lore-service)');
}
function handleConnectError(error) {
    console.error('Erreur de connexion à MongoDB :', error);
    process.exit(1);
}

async function connectDB() {
    try {
        const uri = getMongoUri();

        ensureMongoUriExists(uri);

        await mongoose.connect(uri);

        loginSucceed();

    }
    catch(error) {
        handleConnectError(error);

    }
}

module.exports = connectDB;