
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



