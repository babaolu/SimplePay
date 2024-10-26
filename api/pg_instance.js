import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ max: 20, });

async function dbSetup() {
  try {
    const client = await pool.connect();
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      firstName VARCHAR(32),
      lastName VARCHAR(32),
      email VARCHAR(48));`);
    
    await client.query(`CREATE TABLE IF NOT EXISTS accounts (
      id VARCHAR(64) PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      accountNumber CHAR(10),
      bankName VARCHAR(64),
      user_id VARCHAR(64),
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id));`);

    client.release(true);
  } catch (err) {
    console.error(err);
  }
}
