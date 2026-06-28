function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Authentication required" });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ status: "error", message: "Insufficient permissions" });
      return;
    }

    next();
  };
}

module.exports = {
  requireAdmin: requireRole("admin"),
  requireDoctor: requireRole("doctor"),
  requirePatient: requireRole("patient"),
  requireRole,
};
