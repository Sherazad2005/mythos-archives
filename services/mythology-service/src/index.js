require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mythologyRoutes = require("./routes/mythology.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, service: "mythology-service" }));

app.use("/mythology", mythologyRoutes);

app.use((err, req, res, next) => {
  console.error("mythology-service error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`mythology-service running on http://localhost:${PORT}`));
