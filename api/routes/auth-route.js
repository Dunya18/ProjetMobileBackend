const router = require("express").Router();
const { login, register, checkExistance } = require("../../controllers/auth-controller")


router.post("/login", login)
router.post("/register", register)
router.post("/existance", checkExistance)

module.exports = router;