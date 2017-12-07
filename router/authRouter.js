let express = require('express');
let app = express();
let router = express.Router();

//Import PassportInitializer
let passport = require("../config/passport.js");

//Import keys
let keys = require("../config/keys");

// Facebook OAuth
router.get("/facebook",passport.authenticate("facebook"),(req,res)=>{

});
// Facebook OAuth callback
router.get('/facebook/callback',passport.authenticate("facebook" ),(req,res)=>{
	res.redirect("/");
});

module.exports = router