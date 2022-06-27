const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  imglink: String,
  nom: { type: String},
  commune: { type: String},
  latitude: { type: Number },
  longitude: { type: Number },
  horraireOuver: { type: Number},
  horraireFerm: { type: Number },
  tarifHeure: { type: Number },
  nbPlace: { type: Number}
}, { timestamps: true });

module.exports = Parking = mongoose.model("parking", parkingSchema);
