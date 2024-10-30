import { pool } from './pg_instance.js';

export default async function createUser(req, res) {
  const { id, firstName, lastName, email } = req.body;
  let client;
  try {
    client = await pool.connect();
    await client.query(`INSERT INTO users (id, firstName, lastName, email)
      VALUES ($1, $2, $3, $4);`, [id, firstName, lastName, email]);
    res.status(200).send();
  } catch(error) {
    res.status(500).send();
    console.error(error);
  } finally {
    if (client) { client.release(); }
  }
}