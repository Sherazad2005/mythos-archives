require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const creatureRoutes = require("./route/creature.route");
const testimonyRoutes = require("./route/testimony.routes");
const statsRoutes = require("./route/stats.routes");

const app = express();
app.use(express.json());

connectDB();

app.use("/creatures", creatureRoutes);
app.use("/testimonies", testimonyRoutes);
app.use("/stats", statsRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Lore-service running on port ${PORT}`);
});



