const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/user'); //User Model

//Register Form
router.get('/register', function(req, res) {
  res.render('register');
});

//Register Proccess
router.post('/register', function(req, res) {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  //Validate User Input
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'Email is required').notEmpty();
  req.checkBody('username', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();
  if (errors)
    res.render('register', {
      errors:errors
    });
  else {
    let newUser = new User({
      name:name,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err)
          console.log(err);
        newUser.password = hash;
        newUser.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success','Account Created! You can log in now.');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

//Login Form
router.get('/login', function(req, res) {
  res.render('login');
});

//Login Process
router.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

//Logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/');
});

//Edit User Info Form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (user.id != req.user._id) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_user', {
      title:'Edit User',
      user:user
    });
  });
});

//Edit User Info
router.post('/edit/:id', function(req, res) {
  let user = {};
  user.name = req.body.name;
  user.username = req.body.username;
  user.desc = req.body.desc;
  User.updateOne({_id:req.params.id}, user, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'User Information Updated');
      res.redirect('/');
    }
  });
});

//Get Single User
router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    res.render('user', {
      email:user.username,
      username:user.name,
      description:user.desc,
      id:user.id
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