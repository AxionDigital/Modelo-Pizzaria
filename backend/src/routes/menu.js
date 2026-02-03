const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../config/upload");
const controller = require("../controllers/menuController");

// GET
router.get("/", controller.listar);

// POST
router.post(
  "/",
  upload.single("imagem"),
  auth,
  controller.criar
);

// PUT
router.put(
  "/:id",
  auth,
  upload.single("imagem"),
  controller.atualizar
);

// DELETE
router.delete("/:id", auth, controller.remover);

module.exports = router;
