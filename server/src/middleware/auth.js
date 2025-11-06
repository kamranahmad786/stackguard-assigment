import jwt from "jsonwebtoken";

export const auth = (requireConfigured = false) => {
  return (req, res, next) => {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (requireConfigured && !payload.isConfigured) {
        return res.status(403).json({ message: "Configuration required" });
      }
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid/expired token" });
    }
  };
};
