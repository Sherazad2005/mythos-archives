require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/auth", createProxyMiddleware({ target: "http://localhost:4000", changeOrigin: true }));
app.use("/lore", createProxyMiddleware({ target: "http://localhost:4001", changeOrigin: true }));

app.listen(3000, () => {
  console.log("API Gateway running on http://localhost:3000");
});
