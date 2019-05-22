const LocalStrategy = require("passport-local").Strategy;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let { User } = require("../models/User");

// module.exports = function(passport) {
//   // passport.use(
//   //   new LocalStrategy(function(email, password, done) {
//   //     User.findOne({ email: email }, function(err, user) {
//   //       if (err) {
//   //         return done(err);
//   //       }
//   //       if (!user) {
//   //         console.log("not a user");
//   //         return done(null, false, { message: "Not A User" });
//   //       }
//   //       // if (!user.verifyPassword(password)) { return done(null, false); }
//   //       // return done(null, user);
//   //     });
//   //   })
//   // );
//   passport.use(
//     new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//       User.findOne({
//         email: email
//       }).then((user, err) => {
//         if (!user) {
//           console.log("not a user");

//           return done(null, false, { err: "not a user" });
//         } else {
//           done();
//           console.log("is a user");
//         }
//       });
//       // console.log(email);
//     })
//   );
// };

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: "No User Found" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password Incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
