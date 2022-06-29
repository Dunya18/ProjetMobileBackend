const Parking = require("../models/Parking");
const Reservation = require("../models/Reservation");
const User = require("../models/User");

const getAllReservationsService = async (userId) => {
  try {
    const reservations = await Reservation.find({ user: userId })
    return {
      code: 200,
      data: reservations
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

const createReservationService = async ({ userId, parkingId, dateEntree, dateSortie }) => {
  try {

    const parking = await Parking.findById(parkingId)
    if (!parking) return { code: 400, data: { msg: "Parking doesn't exist" } }
    const dateStart = new Date(dateEntree)
    dateStart.setHours(0)
    dateStart.setMinutes(0)
    dateStart.setSeconds(0)

    const dateEnd = new Date(dateSortie)
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
      parking: parkingId
    })

    if (reservationsForTheDay.length >= parking.nbPlace) return { code: 400, data: { msg: "No places available" } }

    const reservation = await Reservation.create(
      {
        user: userId,
        parking: parkingId,
        dateEntree,
        dateSortie,
        numeroPlace: reservationsForTheDay.length + 1
      }
    )

    if (!reservation) return { code: 400, data: { msg: "Can't create reservation" } }

    return {
      code: 200,
      data: reservation
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


module.exports = { getAllReservationsService, createReservationService }