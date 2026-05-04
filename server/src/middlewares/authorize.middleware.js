
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!req.user) {
      return res.status(401).json({ 
        message: "Unauthorized - Authentication required" 
      });
    }

    
    if (!req.user.role) {
      return res.status(401).json({ 
        message: "Unauthorized - User role not found" 
      });
    }

    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Forbidden - You do not have permission to perform this action",
        requiredRoles: allowedRoles,
        yourRole: req.user.role,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
