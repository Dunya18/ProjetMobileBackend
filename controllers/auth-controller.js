const { loginService, registerService } = require("../services/auth-service")
const { registerValidation, loginValidation } = require("../utils/validation")

const login = async (req, res) => {
  const { error } = await loginValidation(req.body);

  // Valdidate the attributes
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const response = await loginService(req.body);

  return res.status(response.code).json(response.data);
}

const register = async (req, res) => {
  //const { error } = await registerValidation(req.body);

  // Valdidate the attributes
 // if (error) return res.status(400).json({ msg: error.details[0].message });

  const response = await registerService(req.body);

  return res.status(response.code).json(response.data);
}

module.exports = {
  login,
  register
}