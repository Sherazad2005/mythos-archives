module.exports = function requireRole(...allowed) {
  return (req, res, next) => {
    console.log("requireRole sees req.user:", req.user);

    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
};
