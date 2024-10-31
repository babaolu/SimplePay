import { pool } from './pg_instance.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
export default async function getAccount(req, res) {
  let client;
  let balance_details;
  
  console.log("Entered getAccount!")
  try {
    client = await pool.connect();
    console.log("UID getAccount sees: ", req['uid']);
    const result = await client.query(`SELECT id, bankname FROM accounts
      WHERE user_id=$1;`, [req['uid']]);
    if (result.rows) {
      console.log("Account rows:", result.rows)
      const options = {
        method: 'GET',
        url: `https://api.withmono.com/v2/accounts/${result.rows[0].id}/balance`,
        headers: {accept: 'application/json',
          'mono-sec-key': process.env.MONO_SECRET_KEY
        }
      };
      try {
        const response = await axios.request(options);
        balance_details = response.data.data;
        console.log("Balace details:", balance_details);
      } catch(error) {
        res.status(404).send(error);
        console.error(error);
        return;
      };
      res.status(200).send({
        fullName: balance_details.name,
        accountNumber: balance_details.account_number,
        balance: balance_details.balance,
        bankName: result.rows[0].bankname,
        currency: balance_details.currency
      });
      console.log("Sent");
    }
  } catch(error) {
    res.status(500).send();
    console.error(error);
  } finally {
    if (client) { client.release(); }
  }
}