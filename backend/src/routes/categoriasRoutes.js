const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/categoriaController");

// GET 
router.get("/", auth, controller.listar);

// POST 
router.post("/", auth, controller.criar);

// PUT 
router.put("/:id", auth, controller.atualizar);

// DELETE 
router.delete("/:id", auth, controller.remover);

module.exports = router;
