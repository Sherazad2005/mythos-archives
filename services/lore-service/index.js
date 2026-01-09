const express = require ('express');
const connectDB = require ('./config/db');
const creatureRoutes = require('./routes/creature.routes');

const app = expresss();

//pour lire le json dans le reqbody 

app.use(express.json());

connectDB();

//api pourl les creatures a recup

app.use('/api/creatures', creatureRoutes);

const  PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Lore-service running on port ${PORT}`);
});