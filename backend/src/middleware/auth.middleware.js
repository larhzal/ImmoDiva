const supabase = require('../config/db')

module.exports = async (req, res, next) => {
  try {
    // recuperation de token depuis le header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Token manquant" })
    }

    const token = authHeader.split(' ')[1]

    // verifier le token avec supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ message: "Token invalide" })
    }

    // attacher l'utilisateur a la requete
    req.user = user
    next()

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
}