let express = require('express');
let app = express();
let router = express.Router();

// Import Message model
let Message = require ("../models/message");

//Import the user model
let User = require("../models/user");


router.post("/",(req,res)=>{
	res.type('application/json');
	if(!req.xhr) {
		res.status(400);
		res.send(JSON.stringify({error:"Bad Request"}))
	} else if(!req.user){
		res.status(403);
		res.send(JSON.stringify({error:"Access Not Allowed"}))
	} else if(req.body.message_id===undefined){
		res.status(400);
		res.send(JSON.stringify({error:"Bad Request"}))
	} else {
		Message.find(req.body.message_id,(message)=>{
			User.like(req.user,message,(message)=>{
				res.redirect(303,"/");
			});
		})
	}
});
router.delete("/",(req,res)=>{
	res.type('application/json');
	if(!req.xhr) {
		res.status(400);
		res.send(JSON.stringify({error:"Bad Request"}))
	} else if(!req.user){
		res.status(403);
		res.send(JSON.stringify({error:"Access Not Allowed"}))
	} else if(req.body.message_id===undefined){
		res.status(400);
		res.send(JSON.stringify({error:"Bad Request"}))
	} else {
		Message.find(req.body.message_id,(message)=>{
			User.unlike(req.user,message,(message)=>{
				res.redirect(303,"/");
				
			});
		})
	}
});
module.exports = router;