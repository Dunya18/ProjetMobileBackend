const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true
  },
  family_name: {
    type: String, required: true
  },
  email: {
    type: String, unique: true, required: true
  },
  phone_number: {
    type: String, required: true
  },
  password: {
    type: String, required: true
  },
  photoLink: {type:String, default: "$2a$10$CzZ5OWdzm1rR07.JU4eiouGkiMvEcG6mmbm8fAxPJgaRsUASbOc1S"}
}, { timestamps: true });

module.exports = User = mongoose.model("user", userSchema);
