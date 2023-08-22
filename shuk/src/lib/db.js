// //import mysql from 'mysql2/promise';

// const mysql = require('mysql2/promise');

// async function connectToDatabase() {
//     // Read credentials from environment variables for better security
//     const host = process.env.DB_HOST || 'localhost';
//     const user = process.env.DB_USER || 'myuser';
//     const port = process.env.DB_PORT || 5432;
//     const password = process.env.DB_PASSWORD || 'mypassword';
//     const database = process.env.DB_NAME || 'postgres';
    
//     try {
//         console.log("host: ", host, "user: ", user, "port: ", port, "password: ", password, "database: ", database);

//         const connection = await mysql.createConnection({
//             host: host,
//             user: user,
//             port: port,
//             password: password,
//             database: database
//         });
//         return connection;
//     } catch (error) {
//         console.error('Error connecting to database:', error);
//         throw error;
//     }
// }

// module.exports = {
//     connectToDatabase
// };




import pgPromise from 'pg-promise';

const pgp = pgPromise({});

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'myuser',
  password: 'mypassword'
});

export default db;



