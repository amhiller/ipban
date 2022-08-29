const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },

  allow_list: {
    type: Boolean,
    default: false
  }
},
{
  collection: 'badips'
})

module.exports = mongoose.model("Ip", ipSchema)