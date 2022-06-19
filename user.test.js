const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

describe("User Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:satu1234@sandbox.5ovvl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await User.delete("test");
		await client.close();
	})

	test("New Admin registration", async () => {
		const res = await User.register("test", "password", "+010-1234-5678");
		expect(res.insertedId).not.toBeUndefined();
	})

	test("Duplicate username", async () => {
		const res = await User.register("test", "password")
		expect(res).toEqual({ "status": "Duplicate Username" })
	})

	test("Admin login invalid username", async () => {
		const res = await User.login("test-fail", "password")
		expect(res).toEqual({ "status": "Invalid Username" })
	})

	test("Admin login invalid password", async () => {
		const res = await User.login("test", "password-fail")
		expect(res).toEqual({ "status": "Invalid Password" })
	})

	test("Admin login successfully", async () => {
		const res = await User.login("test", "password")
		expect(res).toEqual(
			expect.objectContaining({
				username: expect.any(String),
				Password: expect.any(String),
				HashedPassword: expect.any(String),
				Phone: expect.any(String),
			})
		);
	})
	test("User has been deleted", async () => {
		const res = await User.delete("test")
		expect(res.deletedCount).toEqual(1)
	})
});

	// test("New user registration", async () => {
	// 	const res = await User.register("tah", "password")
	// 	expect(res).toBe(1)
	// })

	// test("Duplicate username", async () => {
	// 	const res = await User.register("test", "test")
	// 	expect(res).toBe(0)
	// })

	//test("User login invalid username", async () => {
//		const res = await User.login("test", "test1")
//		expect(res).toBe(null)
//	})

	// test("User login invalid password", async () => {
	// 	const res = await User.login("test", "test12")
	// 	expect(res).toBe(0) 
	// })

	// test("User login successfully", async () => {
	// 	const res = await User.login("test", "test")
	// 	expect(res).toBe(1)
	// })

	// test('should run', () => {
	// });
