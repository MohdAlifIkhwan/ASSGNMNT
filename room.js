const bcrypt = require("bcryptjs")
let rooms;

class Room {
	static async injectDB(conn) {
        rooms = await conn.db("Hotel_VMS").collection("rooms")
	}
    /**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * 
	 */
	 static async find(roomno) {
		return rooms.findOne({RoomNumber: roomno})
	}
    static async findbooking(username) {
		return rooms.findOne({username: username})
	}
	static async register(roomno, username, checkin, checkout) {
		// TODO: Check if username exists
		const res = await rooms.findOne({RoomNumber: roomno}) || await rooms.findOne({username: username})
			if (res){
				console.log(res);
				return { status: "room has been booked & username has been used"}
			}
			// TODO: Save user to database
				return await rooms.insertOne({
                            "RoomNumber": roomno,
							"username": username,
							"Checkin": checkin ,
							"Checkout": checkout});
	}


	// static async login(username, password) {
	// 		// TODO: Check if username exists
	// 		const result = await users.findOne({'username':username});
	// 			if (!result){
	// 				return { status: "Invalid Username"};
	// 			}

	// 		// TODO: Validate password
	// 			const com = await bcrypt.compare(password, result.HashedPassword)
	// 			if (!com){
	// 				return { status: "Invalid Password"};
	// 			}
	// 		// TODO: Return user object
	// 			return result;
				
	// }
	
		

		static async delete(username) {
			return rooms.deleteOne({username:username})
		}

		static async update(username, checkin, checkout){

            return rooms.updateOne({username:username},{$set:{
                "Checkin": checkin,
                "Checkout": checkout}})
        }
    
	}

module.exports = Room;