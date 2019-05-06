const express = require('express');
const router = express.Router();

//Job Listing Model
let Job_listing = require('../models/job_listing');
//User Model
let User = require('../models/user');

//Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_job_listing', {
    title:'Create Job Listing'
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
    res.render('add_job_listing', {
      title:'Create Job Listing',
      errors:errors
    });
  } else {
    let job_listing = new Job_listing();
    job_listing.title = req.body.title;
    job_listing.author = req.user._id;
    job_listing.desc = req.body.desc;
    job_listing.pay = req.body.pay;
    job_listing.address = req.body.address;
    //Images will probably have to be saved here

    job_listing.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Job Listing Added');
        res.redirect('/listings/');
      }
    });
  }
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Job_listing.findById(req.params.id, function(err, job_listing){
    if(job_listing.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/listings/');
    }
    res.render('edit_job_listing', {
      title:'Edit Job Listing',
      job_listing:job_listing
    });
  });
});

//Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let job_listing = {};
  job_listing.title = req.body.title;
  job_listing.desc = req.body.desc;
  job_listing.pay = req.body.pay;
  job_listing.address = req.body.address;
  //Images will probably have to be updated here

  let query = {_id:req.params.id}

  Job_listing.updateOne(query, job_listing, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Job Listing Updated');
      res.redirect('/listings/');
    }
  });
});

//Delete job_listing
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Job_listing.findById(req.params.id, function(err, job_listing){
    if(job_listing.author != req.user._id){
      res.status(500).send();
    } else {
      job_listing.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

//Get Single job_listing
router.get('/:id', function(req, res){
  Job_listing.findById(req.params.id, function(err, job_listing){
    User.findById(job_listing.author, function(err, user){
      res.render('job_listing', {
        job_listing:job_listing,
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