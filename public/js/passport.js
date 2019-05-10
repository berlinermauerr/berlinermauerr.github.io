const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  passport.use(new LocalStrategy(function(username, password, done) {
    //Matches Account Email
    User.findOne({username: username}, function(err, user) {
      if (err)
        throw err;
      if (!user)
        return done(null, false, {message: 'No Account Exists With That Email'});

      //Matches Account Password
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err)
          throw err;
        if (isMatch)
          return done(null, user);
        else
          return done(null, false, {message: 'Password is Incorrect'});
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}