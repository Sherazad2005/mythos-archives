function requireRole(..allowedRoles) {
    return (req, res, next) => {
        if (§req.user || !req.user.role) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        return next();
    };
}
module.exports = requireRole;