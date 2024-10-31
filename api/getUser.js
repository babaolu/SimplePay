import { pool } from './pg_instance.js';

export default async function getUser(req, res) {
  let client;
  console.log("Entered getUser!")
  try {
    client = await pool.connect();
    const result = await client.query(`SELECT firstname, lastname FROM users
      WHERE id=$1;`, [req['uid']]);
    res.status(200).send({
      firstName: result.rows[0].firstname,
      lastName: result.rows[0].lastname
    });
  } catch(error) {
    res.status(500).send();
    console.error(error);
  } finally {
    if (client) { client.release(); }
  }
}
