import { pool } from './pg_instance.js';
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();

export default async function unlinkAccount(req, res) {
  let client;
  let account_id;

  console.log("Entered unlinkAccount!")
  try {
    client = await pool.connect();
    console.log("UID unlinkAccount sees: ", req['uid']);
    const result = await client.query(`SELECT id FROM accounts
      WHERE user_id=$1;`, [req['uid']]);
    if (result.rows) {
      console.log("Account rows:", result.rows);
      const options = {
        method: 'POST',
        url: `https://api.withmono.com/v2/accounts/${result.rows[0].id}/unlink`,
        headers: {accept: 'application/json',
          'mono-sec-key': process.env.MONO_SECRET_KEY}
      };
      try {
        const response = await axios.request(options);
        console.log(response.data);
        if (response.status === 200) { account_id = result.rows[0].id; }
      } catch(error) {
        res.status(404).send(error);
        console.error(error);
        return;
      }
      
    } else {
      throw new Error('No account found linked to this user!');
    }
    if (account_id) {
      await client.query(`DELETE FROM accounts WHERE id=$1;`,
        [account_id]);
      res.status(200).send();
    } else {
        throw new Error('Bug detected');
    }
    console.log("Sent");
  } catch(error) {
    res.status(500).send();
    console.error(error);
  } finally {
    if (client) { client.release(); }
  }

  

  
}
