let mongoose = require('mongoose');

//Job Listing Schema
let job_listing_schema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  desc:{
    type: String,
    required: true
  },
  pay:{
    type: String,
    required: false
  },
  address:{
    type: String,
    required: false
  }
});

let Job_listing = module.exports = mongoose.model('Job_listing', job_listing_schema);