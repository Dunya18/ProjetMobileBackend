const Parking = require("../models/Parking")
const axios = require("axios")
const NodeGeocoder = require('node-geocoder');
const { json } = require("express");

var admin = require("firebase-admin");

var serviceAccount = require("C:/Users/ASUS PRO/Downloads/my-project-1656495659632-firebase-adminsdk-4ixuw-fcec6ab6fc.json");





const createParkingService = async (parking) => {
  try {
    const newParking = await Parking.create(parking)
    admin.initializeApp({
  	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://prismappfcm.firebaseio.com"
});
var topic = 'general';

var message = {
  notification: {
    title: 'Message from admin',
    body: 'new parking added'
  },
  topic: topic
};

    // Send a message to devices subscribed to the provided topic.
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
});
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
const getLatLongService = async (address) => {
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
const latitude = res[0].latitude
const longitude = res[0].longitude 
return { code: 200, data: { latitude, longitude } }
  } catch (e) {
    console.error(e);
    return { code: 500, data: { msg: "Server error..." } }
  }
}

const advancedResearchService = async (address, maxPrice, maxDistance) => {
  try {
    // get the list of the parkings proche de l'adress
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

    // get parkings list where tarifHeure < maxPrice
    const listParkings = await Parking.find({
      tarifHeure: {
        $lte: maxPrice
      },
    })

    let targetParkings = []
    // const myAsyncLoopFunction = async (array) => {
    //   const allAsyncResults = []

    //   for (const item of array) {
    //     const asyncResult = await asyncFunction(item)
    //     allAsyncResults.push(asyncResult)
    //   }

    //   return allAsyncResults
    // }
    // for each parking calculate the distance between the adress and the parking
    for (let parking of listParkings) {
      const { data } = await calculateDistanceService(latitudeSaved, longitudeSaved,
        parking.latitude, parking.longitude)
      if (data.lengthInMeters <= maxDistance) {
        console.log(data);
        console.log(parking);
        targetParkings.push(parking)
      }
    }
    return {
      code: 200,
      data: targetParkings
    }

  } catch (e) {
    console.error(e);
    return {
      code: 500,
      data: {
        msg: "server error..."
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
    return { code: 200, data:   { travelTimeInSeconds, lengthInMeters } }
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
const getParkingByIdService = async (parkingId) => {
  try {
    let parking = await Parking.findById(parkingId)

    const dateStart = new Date()
    dateStart.setHours(0)
    dateStart.setMinutes(0)
    dateStart.setSeconds(0)

    const dateEnd = new Date()
    dateEnd.setHours(0)
    dateEnd.setMinutes(0)
    dateEnd.setSeconds(0)
    dateEnd.setMilliseconds(0)
    dateEnd.setHours(24)

    const reservationsForTheDay = await Reservation.find({
      dateEntree: {
        $gte: dateStart
      },
      dateSortie: {
        $lte: dateEnd
      },
      parking: parking.id
    })

    let data = JSON.parse(JSON.stringify(parking));
    data.reserved = reservationsForTheDay.length
    return {
      code: 200,
      data
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
  searchNearestParkingService,
  getLatLongService,
  advancedResearchService,
}