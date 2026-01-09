const { verifyToken } = require("../utils/jwt");

module.exports = function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
  return res.status(401).json({ error: "Missing Bearer token" });
}


  try {
    const token = auth.split(" ")[1];
    req.user = verifyToken(token); 
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
