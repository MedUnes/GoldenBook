// Import the passport Module
let passport = require("passport");

//Import FacebookStrategy Module
let FacebookStrategy = require('passport-facebook').Strategy;

// Import filesystem
let fs = require('fs');

// Import credentials
let keys = require("./keys")

// Import the user model
let User = require("../models/user");

// user.id is saved in the req.session.passport.user
passport.serializeUser((user,done)=>{
	return done(null,user.id);
})

// id is used to retrieve user object which will be available at req.user
passport.deserializeUser((id,done)=>{
	User.find(id,(user)=>{
		return done(null,user)
	});
})

passport.use(new FacebookStrategy ({
    clientID 	: keys.passport.facebook.app_id,
    clientSecret: keys.passport.facebook.app_secret,
    callbackURL : keys.passport.facebook.app_callback
  },
  (accessToken, refreshToken, profile, cb) =>{
    User.findOrCreate("facebookId",{
    	facebookId:profile.id,
    	firstName:profile.displayName.split(" ")[0],
    	lastName:profile.displayName.split(" ")[1],
      photo:"default.png"
    },(user, err)=> {
      // Create personal directory for the new user
      if (!fs.existsSync(`./public/images/user/${user.row.id}`)){
          fs.mkdirSync(`./public/images/user/${user.row.id}`);
      }
      cb(null,user)
    });
  }));
module.exports = passport;