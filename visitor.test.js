const MongoClient = require("mongodb").MongoClient;
const Visitor = require("./visitor");


describe("User Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:satu1234@sandbox.5ovvl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(client);
	})

	afterAll(async () => {
		await Visitor.delete("test");
		await client.close();
	})

	test("New visitor registration", async () => {
		const res = await Visitor.register("test", "990788667", "+010-1234-5678", "122");
		expect(res.insertedId).not.toBeUndefined();
	})

	test("Duplicate username & room ", async () => {
		const res = await Visitor.register("test", "23")
		expect(res).toEqual({ "status": "Duplicate Username Or Room Has Been Booked" })
	})

	test("Delete visitor info", async () => {
		const res = await Visitor.delete("test")
		expect(res.deletedCount).toEqual(1)
	})

    // test("Update Vistor", async () => {
    //     const res = await Visitor.update("ali", "1.1.22", "2.3.22")
    //    expect(res.modifiedCount).toEqual(1)
    // })
	// test("User login invalid password", async () => {
	// 	const res = await Visitor.login("test", "password-fail")
	// 	expect(res).toEqual({ "status": "invalid password" })
	// })

	// test("User login successfully", async () => {
	// 	const res = await Visitor.login("test", "password")
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