let express = require('express');
let app = express();
let router = express.Router();

// Import filesystem
let fs = require('fs');

// Import Message model
let User = require ("../models/user");
// Import custom flash middleware
let flash = require("../middlewares/flash");

// Import multer for file-uploads multipart forms
let multer  = require('multer');
let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/user/')
	},
	filename: function (req, file, cb) {
		cb(null, `${req.user.row.id}/${file.originalname}`)
	}
});
let upload = multer({
	storage: storage,
	limits: { fileSize: 2*1024*1024 }
});
router.use(flash);
router.get("/",(req,res)=>{

	if(!req.user) {
		res.redirect("/login");
	} else {
		res.render("pages/profile",{user:req.user.row});
	}
});

router.post("/",upload.single('photo'),(req,res,next)=>{
	if(!req.user) {
		res.redirect("/login");
	} else {
		//If the message body is empty
		if(req.body.firstName===undefined || req.body.firstName===""){
			//flash an error message
			req.flash("error","First name can't be empty");
			// Redirect to home
			res.redirect("/profile");
		} else if(req.body.lastName===undefined || req.body.lastName===""){
			req.flash("error","Last name can't be empty");
			res.redirect("/profile");
		// If the message body is not empty
	} else {
		let user = {
			id:req.user.row.id,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			photo:req.file
		};
		User.find(req.user.row.id,(u)=>{
			if(req.file && fs.existsSync(`public/images/user/${u.row.photo}` && u.row.photo!==req.file.filename)){
				fs.unlink( `public/images/user/${u.row.photo}`, (err) => {
					if (err) throw err;
					User.update(user,(updatedUser)=>{
						req.flash("success","Profile updated!");
						res.redirect("/profile");
					});	
				});
			} else {
				User.update(user,(updatedUser)=>{
					req.flash("success","Profile updated!");
					res.redirect("/profile");
				});	
			}
		});
	}
}
});
module.exports = router;