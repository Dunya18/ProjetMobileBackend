const router = require("express").Router();
const { getAllParkings, getParkingById, searchParkingByName, calculateDistance, createParking ,searchNearestParking, getLatLong} = require("../../controllers/parkings-controller")

router.post("/create", createParking)
router.get("/", getAllParkings)
router.get("/:id", getParkingById)
router.post("/search", searchParkingByName)
router.post("/distance", calculateDistance)
router.get("/search/:address", searchNearestParking)
router.get("/latlong/:address", getLatLong)
module.exports = router;