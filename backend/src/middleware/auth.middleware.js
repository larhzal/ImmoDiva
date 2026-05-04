const jwt = require("jsonwebtoken");

// Use this temporarily instead of the real protect middleware
// const protectDev = (req, res, next) => {
//   req.user = { id: "ac989030-6794-455f-9b91-1a0e42248439", role: "publisher" }; // hardcode a real user ID from your DB
//   // req.user = { id: "a3228979-6fd7-4f1a-a6d6-869e9f1b5829", role: "client" }; // hardcode a real user ID from your DB
//   next();
// };

const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Décoder le token avec ta clé secrète définie dans ton .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Injecter les infos de l'utilisateur dans la requête
      req.user = { id: decoded.id, role: decoded.role };
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Non autorisé, token invalide" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Non autorisé, aucun token fourni" });
  }
};

module.exports = { protect, protectDev };