const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/statsController");


// GET
router.get("/", auth, controller.stats);

module.exports = router;
