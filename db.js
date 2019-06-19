const { Pool } = require('pg');

//Conexion a bd
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'logindb',
	password: 'postgres',
	port: 5432
});

// pool.query('SELECT NOW()', (err, res) => {
// 	console.log(err, res);
// 	pool.end();
// });

// const client = new Client({
// 	user: 'postgres',
// 	host: 'localhost',
// 	database: 'logindb',
// 	password: 'postgres',
// 	port: 5432
// });

// client.connect();

// client.query('SELECT NOW()', (err, res) => {
// 	console.log(err, res);
// 	client.end();
// });

module.exports = pool;