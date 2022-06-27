const Parking = require("../models/Parking")
const axios = require("axios")
const NodeGeocoder = require('node-geocoder');
const { json } = require("express");



const createParkingService = async (parking) => {
  try {
    const newParking = await Parking.create(parking)
    return {
      code: 200,
      data: newParking
    }
  } catch (e) {
    console.error(e);
    return {
      code: 500,
      data: {
        msg: "Server error..."
      }
    }
  }
}

const getAllParkingsService = async () => {
  try {
    const parkingsList = await Parking.find({})
    return {
      code: 200,
      data: parkingsList
    }
  } catch (e) {
    console.error(e);
    return {
      code: 500,
      data: {
        msg: "Server error..."
      }
    }
  }
}

const getParkingByIdService = async (parkingId) => {
  try {
    const parkingsList = await Parking.findById(parkingId)
    return {
      code: 200,
      data: parkingsList
    }
  } catch (e) {
    console.error(e);
    return {
      code: 500,
      data: {
        msg: "Server error..."
      }
    }
  }
}

const searchNearestParkingService = async (address) => {
try{
  const options = {
  provider: 'google',

  // Optional depending on the providers
  // fetch: customFetchImplementation,
  apiKey: 'AIzaSyCmkShDzip1-oGS8iUXbudxXeStdnClGes', // for Mapquest, OpenCage, Google Premier
  formatter: 'json' // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

// Using callback
const res = await geocoder.geocode(address + 'Algeria');

// get latitude et longitude
const latitudeSaved = res[0].latitude
const longitudeSaved = res[0].longitude

 const listParkings = await Parking.find({
      latitude: {
        $gte: latitudeSaved - 0.1
      },
      latitude: {
        $lte: latitudeSaved + 0.1
      },
      longitude: {
        $gte: longitudeSaved - 0.1
      },
      longitude: {
        $lte: longitudeSaved + 0.1
      },
    })
    return {
      code: 200,
      data: listParkings 
    }
}catch (e) {
    console.error(e);
    return {
      code: 500,
      data: {
        msg: "Server error..."
      }
    }
  }
}



const calculateDistanceService = async (departLat, departLag, destLat, destLag) => {
  const url = `https://api.tomtom.com/routing/1/calculateRoute/${departLat},${departLag}:${destLat},${destLag}/json?key=${process.env.TOMTOM_APIKEY}`
  try {

    const response = await axios.get(url)
    const summary = response.data.routes[0].summary
    const { travelTimeInSeconds, lengthInMeters } = summary
    return { code: 200, data: { travelTimeInSeconds, lengthInMeters } }
  } catch (e) {
    console.error(e);
    return { code: 500, data: { msg: "Server error..." } }
  }
}
const searchParkingByNameService = async (searchTerm) => {
  try {
    const parkingsList = await Parking.find({ nom: { $regex: searchTerm } });
    return {
      code: 200,
      data: parkingsList
    }
  } catch (e) {
    console.error(e);
    return {
      code: 500,
      data: {
        msg: "Server error..."
      }
    }
  }
}





module.exports = {
  getAllParkingsService,
  searchParkingByNameService,
  getParkingByIdService,
  calculateDistanceService,
  createParkingService,
  searchNearestParkingService
}