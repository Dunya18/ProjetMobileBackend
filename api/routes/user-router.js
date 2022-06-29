const router = require("express").Router();
const { rateParking, getRatedParking } = require("../../controllers/user-controller")

router.post("/rate", rateParking)
router.get("/rate/:userId", getRatedParking)

module.exports = router;