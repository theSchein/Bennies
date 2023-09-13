
import pgPromise from 'pg-promise';

const pgp = pgPromise({});

const db = pgp({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.POSTGRES_DATABASE || 'postgres',
  user: process.env.POSTGRES_USER || 'myuser',
  password: process.env.POSTGRES_PASSWORD || 'mypassword',
  ssl: {
    rejectUnauthorized: false
  },
})

export default db;



