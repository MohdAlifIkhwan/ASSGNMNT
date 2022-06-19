const supertest = require('supertest');
const request = supertest('http://localhost:3002');

   describe('Express Route Test', function () {
// 	it('should return hello world', async () => {
// 		return request.get('/hello')
// 			.expect(200)
// 			.expect('Content-Type', /text/)
// 			.then(res => {
// 				expect(res.text).toBe('Hello BENR2423');
// 			});
// 	})

	it('login Admin successfully', async () => {
		return request
			.post('/login')
			.send({username: 'alif', password: "satu1234" })
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({
						_id: expect.any(String),
						username: expect.any(String),
						token: expect.any(String),
					})
				);
			});
	});
	// it('register Visitor successfully', async () => {
	// 	return request
	// 		.post('/visitor/register')
	// 		.send({username: 'test', IdentityCard: '991288234412', Phone: '01233994123', RoomNumber: '50'})
	// 		.expect('Content-Type', /text/)
	// 		.expect(200).then(res => {
	// 			expect(response.text).toBe("Duplicate Username Or Room Has Been Booked");
	// 		});
	// 	})
	
});