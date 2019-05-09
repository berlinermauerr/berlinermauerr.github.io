const express = require('express');
const router = express.Router();

let Job_request = require('../models/job_request'); //Job Request Model
let User = require('../models/user'); //User Model

//Add Route
router.get('/add', ensureAuthenticated, function(req, res) {
  res.render('add_job_request', {
    title:'Create Job Request'
  });
});

//Add Job Request
router.post('/add', function(req, res) {
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('desc','Description is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors)
    res.render('add_job_request', {
      title:'Create Job Request',
      errors:errors
    });
  else {
    let job_request = new Job_request();
    job_request.title = req.body.title;
    job_request.author = req.user._id;
    job_request.desc = req.body.desc;

    job_request.save(function(err) {
      if (err) {
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
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
  Job_request.findById(req.params.id, function(err, job_request) {
    if (job_request.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/requests/');
    }
    res.render('edit_job_request', {
      title:'Edit Job Request',
      job_request:job_request
    });
  });
});

//Edit Job Request
router.post('/edit/:id', function(req, res) {
  let job_request = {};
  job_request.title = req.body.title;
  job_request.desc = req.body.desc;
  Job_request.updateOne({_id:req.params.id}, job_request, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Job Listing Updated');
      res.redirect('/requests/');
    }
  });
});

//Delete Job Request
router.delete('/:id', function(req, res) {
  if (!req.user._id)
    res.status(500).send();
  Job_request.findById(req.params.id, function(err, job_request) {
    if (job_request.author != req.user._id)
      res.status(500).send();
    else {
      job_request.remove({_id:req.params.id}, function(err) {
        if (err)
          console.log(err);
        res.send('Success');
      });
    }
  });
});

//Get Job Request
router.get('/:id', function(req, res) {
  Job_request.findById(req.params.id, function(err, job_request) {
    User.findById(job_request.author, function(err, user) {
      res.render('job_request', {
        job_request:job_request,
        author:user.name
      });
    });
  });
});

//Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else {
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;