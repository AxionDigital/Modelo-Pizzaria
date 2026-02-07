const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // 👈 ISSO É OBRIGATÓRIO

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Usuário não encontrado" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 🍪 AQUI É O COOKIE
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  });
};

exports.logout = (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.json({ success: true });
};


