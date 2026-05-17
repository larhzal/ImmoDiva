const {supabase} = require('../config/db')

module.exports = (roleRequis) => {
  return async (req, res, next) => {
    try {
      const { data: userData, error } = await supabase
        .from('User')   
        .select('role')
        .eq('id', req.user.id)
        .single()

      if (error || !userData) {
        return res.status(403).json({ message: "Utilisateur non trouvé" })
      }

      if (userData.role !== roleRequis) {
        return res.status(403).json({
          message: `Accès refusé. Rôle requis : ${roleRequis}`
        })
      }

      req.user.role = userData.role
      next()

    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message })
    }
  }
}