const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const role = async (req, res, next) => {
  try {
    // Obtenha o ID do usuário a partir do token decodificado
    const { userId } = req.user;

    // Verifique se o usuário é um administrador
    const user = await User.findByPk(userId);
    if (!user || user.role !== "admin") {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Acesso negado." });
    }

    // Se o usuário for um administrador, continue para a próxima etapa
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authenticated Invalid");
  }
};

module.exports = role;