require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const menuRoutes = require("./src/routes/menu");
const categoriasRoutes = require("./src/routes/categorias");
const pedidoRoutes = require("./src/routes/pedidoRoutes");
const statsRoutes = require("./src/routes/statsRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () =>
  console.log(`🔥 Backend rodando na porta ${PORT}`)
);
