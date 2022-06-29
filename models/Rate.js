const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
  comment: { type: String},
  note: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  parking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parking'
  }
}, { timestamps: true });

module.exports = Rate = mongoose.model("rate", rateSchema);
