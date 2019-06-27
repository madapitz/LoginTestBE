const router = require('express').Router();

const bcrypt = require('bcryptjs');

const secret = 'for whom the bell tolls';

const passport = require('passport');
const jwt = require('jsonwebtoken');

const pool = require('../db')

router.post('/register', async (req, res) => {
	try {
		let rows = await pool.query('SELECT u_id FROM usuario WHERE u_email = $1',[req.body.email]);
		if (rows.rows.length > 0) {
			let error = 'Email address already exists';
			return res.status(400).json(error); 
		} else {
			// try {
			// 	let salt = await bcrypt.genSalt(10);
			// 	let password = await bcrypt.hash(req.body.password, salt);
			// } catch (e) {
			// 	console.log(e);
			// 	return res.status(400).json(e);
			// }

			// bcrypt.genSalt(10, (err, salt) => {
			// 	if (err) throw err;
			// 	bcrypt.hash(req.body.password, salt).then((hash) => {
			// 		password = hash;

			// 	}).catch((err) => {
			// 		if(err) throw err;
			// 	});
			// });
			// console.log(password.length);
			try {
				let salt = await bcrypt.genSalt(10);
				let password = await bcrypt.hash(req.body.password, salt);
				let newUser = await pool.query(`
					INSERT INTO usuario (u_username, u_email, u_password, u_birth, u_fname, u_lname) values 
					($1, $2, $3, $4, $5, $6)
				`,[
					req.body.username,
					req.body.email,
					password,
					req.body.bdate,
					req.body.fname,
					req.body.lname
				]);
				return res.status(200).json({message: "register successful"});
			} catch (e) {
				console.log(e);
				return res.status(400).json(e); 
			}
		}

	} catch (e) {
		console.log(e);
		return res.status(400).json(e); 
	}
});

router.post('/login', async (req,res) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		let checkEmail = await pool.query('SELECT u_password, u_id, u_username FROM usuario WHERE u_email = $1',[email]);
		if (checkEmail.rows.length === 0) {
			let error = "No account found";
			return res.status(404).json(error);
		}

		let isMatch = bcrypt.compare(password, checkEmail.rows[0].u_password);

		

		if (isMatch) {
			const payload = {
				id: checkEmail.rows[0].u_id,
				name: checkEmail.rows[0].u_username
			};

			jwt.sign(payload, secret, {expiresIn: 36000}, (err, token) => {
				if (err) return res.status(500).json({error: "Error signing token", raw: err});

				return res.json({success: true, token: `${token}`});
			});
		} else {
			return res.status(400).json({
				error: "Password is incorrect"
			});
		}

	} catch (err) {
		console.log(err)
	}

	// console.log(checkEmail.rows)
	// bcrypt.compare(password, checkEmail.rows[0].password)
	// 	.then(isMatch => {
	// 		if (isMatch) {
	// 			const payload = {
	// 				id: checkEmail.rows[0].u_id,
	// 				name: checkEmail.rows[0].u_username
	// 			};

	// 			jwt.sign(payload, secret, {expiresIn: 36000}, (err, token) => {
	// 				if (err) return res.status(500).json({error: "Error signing token", raw: err});

	// 				return res.json({success: true, token: `Bearer ${token}`});
	// 			});
	// 		} else {
	// 			return res.status(400).json({
	// 				error: "Password is incorrect"
	// 			});
	// 		}
	// 	})
	// 	.catch(err => {
	// 		console.log(err)
	// 	});
});

module.exports = router;