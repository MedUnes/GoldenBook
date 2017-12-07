// Import Message model
let connection = require ("../config/db");

// Import Moment  Middleware
let moment = require("moment");

// Import the FileSystem module
let fs = require("fs");
// Import the FileSystem module
let http = require("http");


class User{
	static keyNames(){
		return ["id","facebookId"];
	}
	constructor(row){
		this.row = row;

	}
	get id(){
		return this.row.id;
	}
	get lastName(){
		return this.row.firstName
	}
	get firstName(){
		return this.row.firstName;
	}
	get photo(){
		return this.row.photo;
	}
	get fullName(){
		return `${this.row.firstName} ${this.row.lastName}`;
	}
	get facebookId(){
		return this.row.facebookId;
	}
	get created_at(){
		return this.row.created_at;
	}
	static like (user,message,callback){
		connection.query("SELECT * FROM likes WHERE message_id=? AND user_id = ?",[message.id,user.id],(error,results,fields)=>{
			if(error) console.log(error);
			// Run the callback function once terminated
			if(results.length===0){
				// Run the callback function once terminated
				connection.query("INSERT INTO likes SET message_id=?, user_id = ?",[message.id,user.id],(error,results,fields)=>{
					callback(message);
				});
			} else {
				// callback on a null parameter forwarding error handling 
				callback(null);
			}	
		});
	}
	static unlike (user,message,callback){
		connection.query("SELECT * FROM likes WHERE message_id=? AND user_id = ?",[message.id,user.id],(error,results,fields)=>{
			if(error) console.log(error);
			// Run the callback function once terminated
			if(results.length===1){
				// Run the callback function once terminated
				connection.query("DELETE FROM likes WHERE message_id=? AND  user_id = ?",[message.id,user.id],(error,results,fields)=>{
					callback(message);
				});
			} else {
				// callback on a null parameter forwarding error handling 
				callback(null);
			}	
		});
	}
	
	static isLiking(user,message,callback){
		connection.query("SELECT * FROM likes WHERE message_id=? AND user_id = ?",[message.id,user.id],(error,results,fields)=>{
			if(error) console.log(error);
			// Run the callback function once terminated
			if(results.length===1){
				callback(true);
			} else {
				// callback on a null parameter forwarding error handling 
				callback(false);
			}	
		});
	}
	static create(user,callback){
		// Insert the new message into the DB
		let sqlString = "INSERT INTO `user` SET firstName = ?,lastName = ?,facebookId = ?, photo = ?,created_at = ?";
		connection.query(
			sqlString,[
				user.firstName,
				user.lastName,
				user.facebookId,
				user.photo,
				new Date()
			],
			(error,results,fields)=>{
				if(error) console.log(error);
				// Run the callback function once terminated
				User.find(results.insertId,callback)
			}
		);
	}
	static all(callback){

		// Get all messages from DB
		connection.query("SELECT * FROM `user`",(error,results,fields)=>{
			if(error) console.log(error);

			// Run the callback function once terminated
			callback(results.map((row)=>{
				return new User(row);
			}));
		});
		
	}
	static find(id,callback){

		// Get all messages from DB
		connection.query("SELECT * FROM `user` WHERE id = ?",[id],(error,results,fields)=>{
			if(error) console.log(error);
			// If the user was found
			if(results.length>=1){
				// Run the callback function once terminated
				let row = results[0];
				callback(new User(row));
			} else {
				// callback on a null parameter forwarding error handling 
				callback(null);
			}			
		});	
	}
	static findOrCreate(keyName,user,callback){
		keyName = User.keyNames().includes(keyName)?keyName:"id";	
		// Get all messages from DB
		connection.query(`SELECT * FROM \`user\` WHERE ${keyName} = ?`,[user[keyName]],(error,results,fields)=>{
			if(error) console.log(error);
			
			// If the user was found
			if(results.length>0){
				let row = results[0];
				// set the found user as a paramater to the callback function
				callback(new User(row));
			} else {
				// create a new user and set it as a paramater to the callback function
 				User.create(user,callback);
			}			
		});
	}
	static update(user,callback){
		if(user.photo){
			connection.query(`UPDATE \`user\` SET firstName = ?, lastName = ?, photo = ? WHERE id =?`,[user.firstName,user.lastName,user.photo.filename,user.id],(error,results,fields)=>{
				if(error) console.log(error);
				User.find(results.updatedId,callback);
			});
		} else {
			connection.query(`UPDATE \`user\` SET firstName = ?, lastName = ? WHERE id =?`,[user.firstName,user.lastName,user.id],(error,results,fields)=>{
				if(error) console.log(error);
				User.find(results.updatedId,callback);
			});
		}
	}

}

// Export the User class
module.exports = User;