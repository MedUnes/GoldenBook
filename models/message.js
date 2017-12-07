// Import Message model
let connection = require ("../config/db");

// Import Moment Session Middleware
let moment = require("moment");

let User = require("./user");


class Message{
	constructor(row){
		this.row = row;
	}
	get id(){
		return this.row.id;
	}
	get content(){
		return this.row.content;
	}
	get created_at(){
		return moment(this.row.created_at);
	}
	get user_id(){
		return this.row.user_id;
	}
	get user(){
		return this.row.user;
	}
	get numberOfLikes() {
		return this.row.numberOfLikes;
	}
	get likers() {
		return this.row.likers;
	}
	static owner(message){
		return new Promise((resolve,reject)=>{
			connection.query("SELECT * FROM `user` WHERE id = ?",[message.user_id],(error,results,fields)=>{
			if(error) console.log(error);
			// If the user was found
			if(results.length>=1){
				// Run the callback function once terminated
				let row = results[0];
				resolve(new User(row));
			} else {
				// callback on a null parameter forwarding error handling 
				reject(null);
			}			
		});	
		})
	}
	static numberOfLikes(message){
		return new Promise((resolve,reject)=>{
			connection.query("SELECT count(*) as numberOfLikes FROM likes WHERE message_id=?",[message.id],(error,results,fields)=>{
				if(error){
					reject(error);
				} else {
					// Run the callback function once terminated
					resolve(results[0].numberOfLikes);
				}	
			});
		})
	}
	static likers(message,callback){
		return new Promise((resolve,reject)=>{
			connection.query("SELECT user_id FROM likes WHERE message_id=?",[message.id],(error_1,results_1,fields_1)=>{
				if(error_1){
					reject(error_1)
				} else {
					if (results_1.length==0) resolve([]);
					connection.query("SELECT * FROM user WHERE id IN(?)",[results_1.map((r)=>{return r.user_id})],(error,results,fields)=>{
						if(error){
							reject(error)
						} else {
							resolve(results.map((result)=>{
								return new User(result);
							}));
						}
					});	
				}
			});	
		});	
	};
	static create(message,userId,callback){
		// Insert the new message into the DB
		connection.query("INSERT INTO `message` SET user_id = ?, content = ?, created_at =?",[userId,message,new Date()],(error,results,fields)=>{
			if(error) console.log(error);
			// Run the callback function once terminated
			Message.all(callback);
		});
	}
	static all(callback){
		// Get all messages from DB
		connection.query("SELECT * FROM message",(error,results,fields)=>{
			if(error) console.log(error);

			// Run the callback function once terminated
			if(results==[]){
				return [];
			}
			Promise.all(results.map((result)=>{
				return Message.owner(result).then((owner)=>{
					result['user'] = owner;
					return result;
				});
			}))
			.then((results)=>{
				return Promise.all(results.map((result)=>{
					return Message.likers(result).then((likers)=>{
						result['numberOfLikes'] = likers.length;
						result['likers'] = likers;
						return result;
					});
				}))
			})
			.then((results)=>{
				callback(results.map((result)=>{
					return new Message(result);
				}));
			});
		});
	}

	static find(id,callback){

		// Get all messages from DB
		connection.query("SELECT * FROM message WHERE id = ?",[id],(error,results,fields)=>{
			if(error) console.log(error);
			if(error) throw error;

			// Run the callback function once terminated
			callback(new Message(results[0]));
		});
		
	}
	static remove(id,callback){
		// Get all messages from DB
		connection.query("DELETE FROM message WHERE id = ?",[id],(error,results,fields)=>{
			if(error) console.log(error);

			// Run the callback function once terminated
			callback();
		});
		
	}
	static findByUser(userId,callback){
		// Get all messages from DB sent by a user given its id
		connection.query("SELECT * FROM message WHERE user_id = ?",[user_id],(error,results,fields)=>{
			if(error) console.log(error);
			// Run the callback function once terminated
			callback(results.map((result)=>{
				return new Message(result);
			}));
		})
	}

}

// Export the Message class
module.exports = Message;