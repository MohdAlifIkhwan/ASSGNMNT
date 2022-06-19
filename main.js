const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Visitor = require("./visitor");
const Room = require("./room");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:satu1234@sandbox.5ovvl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
	Visitor.injectDB(client);
	Room.injectDB(client);
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3002

const jwt = require ('jsonwebtoken');
function generateAccessToken(payload){
	return jwt.sign(payload, "mysecretcode", { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, "mysecretcode", (err, user) => {
		console.log(err);

		if (err) return res.sendStatus(403)

		req.user = user

		next()
	})
}

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MyVMS API for Hotel',
			version: '1.0.0',
		},
		components:{
			securitySchemes:{
				jwt:{
					type: 'http',
					scheme: 'bearer',
					in: "header",
					bearerFormat: 'JWT'
				}
			},
		security:[{
			"jwt": []
		}]
		}
	},
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 *         phone: 
 *           type: string
 */
/**
 * @swagger
 * tags:
 *   name: Admin
 */

/**
 * @swagger
 * tags:
 *   name: Visitor
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: User Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */
app.post('/login', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.username, req.body.password);
	console.log(user.status);
	if (user.status == 'Invalid Password' || user.status == 'Invalid Username') {
		res.status(401).send("Invalid username or password");
	
	}
else{
	res.status(200).json({
		_id: user._id,
		username: user.username,
		token: generateAccessToken({ username: user.username})
	});
}
})
/**
 * @swagger
 * /search/data/visitor/{id}:
 *   get:
 *     description: Get visitor's data
 *     tags: [Visitor]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: 
 *           type: string
 *         required: true
 *         description: username
 *     responses:
 *       200:
 *         description: Search successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 
 * 
 *       404:
 *         description: Invalid username
 */

 app.get('/search/data/visitor/:id', async (req, res) => {
	console.log(req.visitors)
	const data = await Visitor.find(req.params.id);
	if (data)
		res.status(200).json(data)
else
	res.status(404).send("Invalid Username")
});

app.use(verifyToken);
/**
 * @swagger
 * /visitor/register:
 *   post:
 *     security:
 *      - jwt: []
 *     description: Visitor Register
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               IdentityCard: 
 *                 type: string
 *               phone:
 *                 type: string
 *               room_no:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Register new user // Duplicate Username Or Room Has Been Booked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */


 app.post('/visitor/register', async (req, res) => {
	
	console.log(req.body);

	const reg = await Visitor.register(req.body.username, req.body.IdentityCard, req.body.phone, req.body.room_no);
	
	console.log(reg);
	//res.status(200).send("Duplicate Username Or Room Has Been Booked")
	res.json({reg})
})

app.use(verifyToken);
/**
 * @swagger
 * /visitor/booking:
 *   post:
 *     security:
 *      - jwt: []
 *     description: Booking Room
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               roomno: 
 *                 type: string
 *               username: 
 *                 type: string
 *               checkin:
 *                 type: string
 *               checkout:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Booking // Invalid username or room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */


 app.post('/visitor/booking', async (req, res) => {
	
	console.log(req.body);

	const reg = await Room.register(req.body.roomno, req.body.username, req.body.checkin, req.body.checkout);
	
	console.log(reg);

	res.json({reg})
})

app.use(verifyToken);
/**
 * @swagger
 * /booking/update:
 *   patch:
 *     security:
 *      - jwt: []
 *     description: Booking Update
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               Checkin: 
 *                 type: string
 *               Checkout:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update Successful 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username 
 */

	app.patch('/booking/update', async (req, res) => {
	//console.log(req.body);
	const log = await Room.findbooking(req.body.username);
	//console.log(log.status);

	if (log == null) {
		res.status(401).send("invalid username")
	}
	else{
	const update = await Room.update(req.body.username, req.body.Checkin, req.body.Checkout);
	res.json({update}) 
	}
	})


app.use(verifyToken);
/**
 * @swagger
 * /delete/visitor:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: User delete
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string

 *     responses:
 *       200:
 *         description: Successful delete the visitor info
 *         content:
 *           application/json:
 *             schema:
 *             
 */
	app.delete('/delete/visitor', async (req, res) => {
		const del = await Visitor.delete(req.body.username)
        res.json({del})
	
	})

/**
 * @swagger
 * /delete/booking:
 *   delete:
 *     security:
 *      - jwt: []
 *     description: User delete
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string

 *     responses:
 *       200:
 *         description: Successful delete the booking info
 *         content:
 *           application/json:
 *             schema:
 *             
 */
 app.delete('/delete/booking', async (req, res) => {
	const dell = await Room.delete(req.body.username) 

	res.json({dell})

})


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})