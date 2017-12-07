// Import ExpressJS
let express = require("express");
let app = express();

// Import Body Parser
let bodyParser = require("body-parser");

// Import Express Session Middleware
let cookieParser = require("cookie-parser");

// Import Express Session Middleware
let session = require("express-session");


// Import EJS template engine
let ejs = require("ejs");

// Import custom middlewares
let flash = require("./middlewares/flash");

// Import Message model
let Message = require ("./models/message");

//Import the user model
let User = require("./models/user");

//Import PassportInitializer
let passport = require("./config/passport.js");

//Import keys
let keys = require("./config/keys");
//OAuth routes, defined here on purpose after using the session middleware
// Import Routers
let likesRouter = require("./router/likesRouter");
let messageRouter = require("./router/messageRouter");
let profileRouter = require("./router/profileRouter");
let authRouter = require("./router/authRouter");

//Templating
app.set('view engine',"ejs");

//Middlewares
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
console.log("process.env.COOKIEHASH")
app.use("/assets",express.static("public"))
app.use(cookieParser(keys.session.secret))
//app.enable('trust proxy');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
	secret: keys.session.secret,
	resave: true,
	saveUninitialized: true,
	// set this to true for HTTPS deployment, for instance heroku
	cookie: { secure: false }
	// set these to true for heroku deployment.
	//proxy : true,
	//secureProxy: true
}));
//Use middlewares
app.use(passport.initialize())
app.use(passport.session())
app.use(flash)

// Home
app.get("/",(req,res)=>{
	if(!req.user) {
		res.redirect("/login");
	} else {
		if(req.session.flash){
			send(req.session.flash)
		}
		Message.all((messages)=>{
			res.render("pages/index",{messages:messages,user:req.user.row});
		})
	}
	
});

// Handle posted/sent message
app.post("/",(req,res)=>{
	if(!req.user) {
		res.redirect("/login");
	} else {
		//If the message body is empty
		if(req.body.message===undefined || req.body.message===""){
			//flash an error message
			req.flash("error","Empty message :(");
			// Redirect to home
			res.redirect("/");
		// If the message body is not empty
		} else {
			let userId = req.user.row.id;
			// Create a new message and save it.
			Message.create(req.body.message,userId,(messages)=>{
				req.flash("success","Message has been added :)");
				res.redirect("/");
			});	
		}
	}
});

app.get("/login",(req,res)=>{
	res.render("pages/login");
});

app.get("/logout",(req,res)=>{
	req.logout();
	res.redirect("/");
});

app.use("/likes",likesRouter);
app.use("/message",messageRouter);
app.use("/profile",profileRouter);
app.use("/auth",authRouter);
// Listen on port
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

