const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/pedidoController");

// GET
router.get("/", auth, controller.listar);

// POST
router.post("/", controller.criar);

// PUT
router.patch("/:id/status", auth, controller.atualizarStatus);

// DELETE
router.delete("/:id", auth, controller.remover);

module.exports = router;
