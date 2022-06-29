const { rateParkingService, getRatedParkingService } = require("../services/user-service")

const rateParking = async (req, res) => {
  const { parkingId, note, comment, userId } = req.body;
  if (note > 5) return res.status(400).json({ msg: "Rate should be < or = 5" })
  const { code, data } = await rateParkingService(parkingId,  note, comment, userId)
  return res.status(code).json(data)
}

const getRatedParking = async (req, res) => {
  const { parkingId } = req.params;
  const { code, data } = await getRatedParkingService(parkingId)
  return res.status(code).json(data)
}


module.exports = { rateParking, getRatedParking }