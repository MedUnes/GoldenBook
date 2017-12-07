// Import Message model
let connection = require ("../config/db");

class Likes{
	constructor(row){
		this.row = row;
	}
	get id(){
		return this.row.id;
	}
	get user_id(){
		return this.row.user_id;
	}
	get message_id(){
		return this.row.message_id;
	}
	static create(Likes,callback){
		// Insert the new message into the DB
		let sqlString = "INSERT INTO `Likes` SET user_id = ?,message_id = ?";
		connection.query(
			sqlString,[
				Likes.user_id,
				Likes.message_id
			],
			(error,results,fields)=>{
				if(error) console.log(error);
				// Run the callback function once terminated
				Likes.find(results.insertId,callback)
			}
		);
	}
	static findByMessage(message,callback){
		// Get all messages from DB
		connection.query("SELECT * FROM `Likes` WHERE message_id = ?",[message.id],(error,results,fields)=>{
			if(error) console.log(error);

			// Run the callback function once terminated
			callback(results.map((row)=>{
				return new Likes(row);
			}));
		});
		
	}
	static find(message,user,callback){
		// Get all messages from DB
		connection.query("SELECT * FROM `Likes` WHERE message_id = ? AND user_id=?",[message.id,user.id],(error,results,fields)=>{
			if(error) console.log(error);
			// If the Likes was found
			if(results.length>=1){
				// Run the callback function once terminated
				let row = results[0];
				callback(new Likes(row));
			} else {
				// callback on a null parameter forwarding error handling 
				callback(null);
			}			
		});	
	}
	static findOrCreate(keyName,Likes,callback){
		keyName = Likes.keyNames().includes(keyName)?keyName:"id";	
		// Get all messages from DB
		connection.query(`SELECT * FROM \`Likes\` WHERE ${keyName} = ?`,[Likes[keyName]],(error,results,fields)=>{
			if(error) console.log(error);
			
			// If the Likes was found
			if(results.length>0){
				let row = results[0];
				// set the found Likes as a paramater to the callback function
				callback(new Likes(row));
			} else {
				// create a new Likes and set it as a paramater to the callback function
 				Likes.create(Likes,callback);
			}			
		});
	}
	static update(Likes,callback){
		if(Likes.photo){
			connection.query(`UPDATE \`Likes\` SET firstName = ?, lastName = ?, photo = ? WHERE id =?`,[Likes.firstName,Likes.lastName,Likes.photo.filename,Likes.id],(error,results,fields)=>{
				if(error) console.log(error);
				Likes.find(results.updatedId,callback);
			});
		} else {
			connection.query(`UPDATE \`Likes\` SET firstName = ?, lastName = ? WHERE id =?`,[Likes.firstName,Likes.lastName,Likes.id],(error,results,fields)=>{
				if(error) console.log(error);
				Likes.find(results.updatedId,callback);
			});
		}
	}
}

// Export the Likes class
module.exports = Likes;