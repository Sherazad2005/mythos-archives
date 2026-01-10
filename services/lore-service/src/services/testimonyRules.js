const Testimony = require('../models/testimony.model');

// première règle est de vérifier le delai de 5 min
async function checkFiveBetweenTestimony(userId) {
    if (!userId) return; // if no authentification on laisse passer (pas sur de la syntaxe a tester)
    


const fiveMinAgo =  new Date(Date.now() - 5 * 60 * 1000);

const testimonyRecent = await Testimony.findOne({
    authorId: userId,
    createdAt: { $gte: fiveMinAgo },
});

if (testimonyRecent) {
    throw new Error('Attends 5 min entre 2 testimonies please');

}
}

//règle 2 un user peut pas valider son propre témoignage

function noSelfValidation(testimony, userId) {
    if (testimony.authorId && testimony.authorId === userId){
        throw new Error('Impossible de valider son propre témoignage!!!');

}
}

module.exports = {
    checkFiveBetweenTestimony,
    noSelfValidation,
};