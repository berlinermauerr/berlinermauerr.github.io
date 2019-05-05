let mongoose = require('mongoose');

//Job Request Schema
let job_request_schema = mongoose.Schema({
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
  }
});

let job_request = module.exports = mongoose.model('job_request', job_request_schema);