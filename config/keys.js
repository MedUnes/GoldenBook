let keys = {
	db:{
		mysql:{ 
			remote:{
				host 	:  "REMOTE_MYSQL_HOST",
				user 	:  "REMOTE_MYSQL_USERNAME",
				password:  "REMOTE_MYSQL_PASSWORD",
				database:  "REMOTE_MYSQL_DATABASE"
			},
			local:{
				host 	: "localhost",
				user 	:  "MYSQL_USERNAME",
				password:  "MYSQL_PASSWORD",
				database:  "golden_book"
			}
		}
	},
	passport: {
		facebook:{
			app_id 		:"FACEBOOK_APP_ID",
			app_secret 	:"FACEBOOK_APP_SECRET",
			app_callback:"http://localhost:3000/auth/facebook/callback"
		}
	},
	session: {
		secret: "SESSION_SECRET"
	}
}

module.exports = keys;