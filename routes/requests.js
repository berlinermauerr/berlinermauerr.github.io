const express = require('express');
const router = express.Router();

//job_request Model
let Job_request = require('../models/job_request');
//User Model
let User = require('../models/user');

//Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_job_request', {
    title:'Create Job Request'
  });
});

//Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('desc','Description is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_job_request', {
      title:'Create Job Request',
      errors:errors
    });
  } else {
    let job_request = new Job_request();
    job_request.title = req.body.title;
    job_request.author = req.user._id;
    job_request.desc = req.body.desc;

    job_request.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Job Listing Added');
        res.redirect('/requests/');
      }
    });
  }
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Job_request.findById(req.params.id, function(err, job_request){
    if(job_request.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/requests/');
    }
    res.render('edit_job_request', {
      title:'Edit Job Request',
      job_request:job_request
    });
  });
});

//Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let job_request = {};
  job_request.title = req.body.title;
  job_request.desc = req.body.desc;

  let query = {_id:req.params.id}

  Job_request.updateOne(query, job_request, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Job Listing Updated');
      res.redirect('/requests/');
    }
  });
});

//Delete job_request
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Job_request.findById(req.params.id, function(err, job_request){
    if(job_request.author != req.user._id){
      res.status(500).send();
    } else {
      job_request.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

//Get Single job_request
router.get('/:id', function(req, res){
  Job_request.findById(req.params.id, function(err, job_request){
    User.findById(job_request.author, function(err, user){
      res.render('job_request', {
        job_request:job_request,
        author: user.name
      });
    });
  });
});

//Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;