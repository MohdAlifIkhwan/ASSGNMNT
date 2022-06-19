const bcrypt = require("bcryptjs")
let visitors;


class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("Hotel_VMS").collection("Visitors")

	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
     * @param {*} room_no
	 */
	 static async find(username) {
		return visitors.findOne({username: username})
	}
	static async register(username, ic, phone,room_no) {
		// TODO: Check if username exists
		const res = await visitors.findOne({username: username} ) || await visitors.findOne({RoomNumber: room_no})
			if (res){
				console.log(res);
				return { status: "Duplicate Username Or Room Has Been Booked"}
			}
			// TODO: Hash password
			// const salt = await bcrypt.genSalt(10);
			// const hash = await bcrypt.hash(password, salt)
			// TODO: Save user to database
				return await visitors.insertOne({
							"username": username,
							"IdentityCard": ic,
							"Phone": phone,
                            "RoomNumber": room_no});
	}


	// static async login(username, password) {
	// 		// TODO: Check if username exists
	// 		const result = await visitors.findOne({username: username});

	// 			if (!result) {
	// 				return { status: "invalid username" }
	// 			}

	// 		// TODO: Validate password
	// 			const com = await bcrypt.compare(password, result.HashedPassword)
	// 			if (!com){
	// 				return { status: "invalid password"}
	// 			}
	// 		// TODO: Return user object
	// 			return result;
				
	// }
	
		// static async update(username, name, gender, room_no){
		// 		return visitors.updateOne({username:username},{$set:{
        //             "username": username,
        //             "Name": name,
        //             "Gender": gender,
        //             "Room_Number":room_no}})
		// }
        
		static async delete(username) {
			return visitors.deleteOne({username: username})
		}

	}

module.exports = Visitor;