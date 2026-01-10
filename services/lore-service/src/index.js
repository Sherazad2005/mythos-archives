require("dotenv").config();
const express = require ('express');
const connectDB = require ('./config/db');
const creatureRoutes = require("./route/creature.route");
const testimonyRoutes = require("./route/testimony.routes");

const app = express();

//pour lire le json dans le reqbody 

app.use(express.json());

//connexion a la db
connectDB();

// routes

app.use("/creatures", creatureRoutes);
app.use("/testimonies", testimonyRoutes);

const  PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Lore-service running on port ${PORT}`);
});


