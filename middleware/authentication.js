const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {   
    throw new UnauthenticatedError("Authentication token is missing or invalid.");
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = { id: decoded.id, username: decoded.username }; 
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid or expired token.");
  }
};

module.exports = authenticationMiddleware;
