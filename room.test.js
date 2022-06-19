const MongoClient = require("mongodb").MongoClient;
const Room = require("./room");


describe("User Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:satu1234@sandbox.5ovvl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Room.injectDB(client);
	})

	afterAll(async () => {
		await Room.delete("ali");
		await client.close();
	})

	test("New user registration", async () => {
		const res = await Room.register("13", "ali", "1.4.2", "2.4.5");
		expect(res.insertedId).not.toBeUndefined();
	})

	 test("Update Booking", async () => {
	 	const res = await Room.update("ali", "1.2.4", "2.3.33")
		expect(res.modifiedCount).toEqual(1)
	 })

	// test("User login invalid username", async () => {
	// 	const res = await Room.login("test-fail", "password")
	// 	expect(res).toEqual({ "status": "invalid username" })
	// })

	// test("User login invalid password", async () => {
	// 	const res = await Room.login("test", "password-fail")
	// 	expect(res).toEqual({ "status": "invalid password" })
	// })

	// test("User login successfully", async () => {
	// 	const res = await Room.login("test", "password")
	// 	expect(res).toEqual(
	// 		expect.objectContaining({
	// 			username: expect.any(String),
	// 			Password: expect.any(String),
	// 			HashedPassword: expect.any(String),
	// 			Phone: expect.any(String),
	// 		})
	// 	);
	// })
});