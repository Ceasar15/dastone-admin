const { Client } = require('pg');
const config = require('../config/config.js')


const { database, username, password, host } = config.db;

var connectionString = `postgres://${username}:${password}@${host}/${database}`;

const client = new Client({
    connectionString: process.env.DATABASE_URL || connectionString,
})
client.connect().then(() =>{
    console.log("Postgres is Runnig Now!")
})
.catch((err) => {
    console.log('database error')
})

module.exports = client;