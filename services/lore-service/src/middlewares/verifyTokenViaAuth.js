const axios = require('axios');

async function verifyTokenViaAuth(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Accès refusé : token manquant' });
    }

    try {
        const response = await axios.get('http://localhost:4000/auth/me', {
            headers: {
                Authorization: authHeader},
                timeout: 5000,
            
        });
        req.user = response.data;

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Accès refusé : token invalide' });
    }
}
module.exports = verifyTokenViaAuth;