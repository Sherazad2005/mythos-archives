require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "auth-service" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`auth-service running on http://localhost:${PORT}`);
});
