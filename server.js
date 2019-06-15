const express = require('express');
const cp = require('cookie-parser');
const bp = require('body-parser');
const { Pool, Client } = require('pg');
const passport = require('passport');

const app = express();

const port = 3000;

//Conexion a bd
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'logindb',
	password: 'postgres',
	port: 5432
});

pool.query('SELECT NOW()', (err, res) => {
	console.log(err, res);
	pool.end();
});

const client = new Client({
	user: 'postgres',
	host: 'localhost',
	database: 'logindb',
	password: 'postgres',
	port: 5432
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
	console.log(err, res);
	client.end();
});

//inicializar la configuracion de passport.js
app.use(passport.initialize());

//importa la configuracion personalizada de passport.js
require('./passport-config')(passport);

app.use(cp());
app.use(bp.urlencoded({extended: false}));
app.use(bp.json());

//Middleware personalizado que muestra cada request
//que pasa por el api
app.use((req,res,next) => {
	if (req.body) log.info(req.body);
	if (req.params) log.info(req.params);
	if (req.query) log.info(req.query);
	log.info(`Recibido ${req.method} request de ${req.ip} para ${req.url}`);

	next();
});

app.use('/users', require('./routes/user'));

app.listen(port, err => {
	if (err) console.log(err);

	console.log(`Escuchando peticiones en el puerto: ${port}`);
})