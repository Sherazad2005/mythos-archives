const axios = require("axios");

async function verifyTokenViaAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  const baseUrl = process.env.AUTH_SERVICE_URL || "http://localhost:4000";

  try {
    const { data } = await axios.get(`${baseUrl}/auth/me`, {
      headers: { Authorization: authHeader },
      timeout: 5000,
    });

    req.user = { id: data.id, role: data.role };
    return next();
  } catch (err) {
    // Si auth-service renvoie 404, on le verra ici et on renverra 401 côté lore
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyTokenViaAuth;
