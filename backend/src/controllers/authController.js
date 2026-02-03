const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User
    .findOne({ username })
    .select("+password"); // 👈 OBRIGATÓRIO

  if (!user) {
    return res.status(401).json({ message: "Usuário não encontrado" });
  }

  const ok = await user.comparePassword(password); // 👈 método do model
  if (!ok) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    user: {
      id: user._id,
      username: user.username,
      role: user.role
    }
  });
};
