const authService = require("./auth.service");

// REGISTER
exports.register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
      details: error.details || null,
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
      details: error.details || null,
    });
  }
};