import { pool } from './pg_instance.js';
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();

export default async function linkAccount(req, res) {
  const { linkcode } = req.body;
  let client;
  let account_id;
  let details;
  let options = {
    method: 'POST',
    url: 'https://api.withmono.com/v2/accounts/auth',
    headers: {accept: 'application/json', 'Content-Type': 'application/json',
      'mono-sec-key': process.env.MONO_SECRET_KEY
    },
    data: {code: linkcode}
  };
  try {
    const response = await axios.request(options);
    account_id = response.data.data.id;
    console.log("Accound ID:", response.data);
  } catch(error) {
    res.status(400).send(error);
    console.error(error);
    return;
  }

  if (account_id) {
    options = {
      method: 'GET',
      url: `https://api.withmono.com/v2/accounts/${account_id}`,
      headers: {accept: 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY
      }
    };
    try {
      const response = await axios.request(options);
      details = response.data.data.account;
      console.log("Account data:", response.data);
    } catch(error) {
      res.status(404).send(error);
      console.error(error);
      return;
    }
  }

  try {
    client = await pool.connect();
    await client.query(`INSERT INTO accounts
      (id, fullName, bvn, accountNumber, bankName, currency, user_id) VALUES
      ($1, $2, $3, $4, $5, $6, $7);`, [details.id, details.name, details.bvn,
        details.account_number, details.institution.name, details.currency,
        req.uid
      ]);
    res.status(200).send();
  } catch(error) {
    res.status(500).send(error);
    console.error(error);
  } finally {
    if (client) { client.release(); }
  }
}
