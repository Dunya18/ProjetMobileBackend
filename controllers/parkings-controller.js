const { getAllParkingsService,
  searchParkingByNameService,
  getParkingByIdService,
  calculateDistanceService,
  createParkingService,
  searchNearestParkingService,
  getLatLongService,
  advancedResearchService } = require("../services/parkings-service")

const createParking = async (req, res) => {
  const { code, data } = await createParkingService(req.body)
  return res.status(code).json(data)
}

const getAllParkings = async (req, res) => {
  const { code, data } = await getAllParkingsService()
  return res.status(code).json(data)
}

const searchParkingByName = async (req, res) => {
  const { term } = req.body;
  const { code, data } = await searchParkingByNameService(term)
  return res.status(code).json(data)
}

const getParkingById = async (req, res) => {
  const { id } = req.params;
  const { code, data } = await getParkingByIdService(id)
  return res.status(code).json(data)
}

const calculateDistance = async (req, res) => {
  const { departLat, departLag, destLat, destLag } = req.body
  const { code, data } = await calculateDistanceService(departLat, departLag, destLat, destLag)
  return res.status(code).json(data)
}

const searchNearestParking = async (req,res) =>{
  const { address } = req.params;
  const { code, data } = await searchNearestParkingService(address)
  return res.status(code).json(data)
}

const getLatLong = async (req,res) =>{
  const { address } = req.params;
  const { code, data } = await getLatLongService(address)
  return res.status(code).json(data)
}

const advancedResearch = async (req,res) =>{
  const { maxprice,address, maxdistance } = req.body;
  const { code, data } = await advancedResearchService(maxprice,address, maxdistance)
  return res.status(code).json(data)
}
module.exports = { getAllParkings, searchParkingByName, getParkingById, calculateDistance, createParking, searchNearestParking, getLatLong, advancedResearch}