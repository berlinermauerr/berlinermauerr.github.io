const mongoose = require('mongoose');

//User Mongoose Schema
const User = module.exports = mongoose.model('User', mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  desc:{
    type: String,
    required: false
  }
}));