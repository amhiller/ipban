const mongoose = require('mongoose');

const allowed_ipSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },

  allow_list: {
    type: Boolean,
    default: true
  }
},
{
  collection: 'goodips'
})

module.exports = mongoose.model("allowed_Ip", allowed_ipSchema)