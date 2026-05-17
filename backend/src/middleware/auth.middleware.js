const { supabase } = require('../config/db');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès refusé ! Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ✅ Syntaxe correcte pour Supabase v2
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Token invalide ou expiré.' });
    }

    // On attache l'utilisateur à la requête pour que le contrôleur puisse l'utiliser
    req.user = user;
    next();
  } catch (err) {
    console.error('Erreur Auth Middleware:', err);
    // ✅ On renvoie une structure propre en cas de crash interne
    return res.status(500).json({ error: 'Erreur interne du serveur lors de l\'authentification.' });
  }
};

module.exports = authMiddleware;