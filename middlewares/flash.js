// Exported function
module.exports  = function (req,res,next){

	// If session flash exist, define it in locals, then clear the session flash.
	if(req.session.flash){
		res.locals.flash = req.session.flash;
		req.session.flash = undefined;
	}
	req.flash = function(type,content){
		// If the flash object doesn't exist, create it.
		if(req.session.flash === undefined){
			req.session.flash={};
		}
		req.session.flash[type]=content;
	}

	next();
};