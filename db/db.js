//const { Client } = require('node-postgres')
const { Client } = require('pg');
const express = require('express');

const client = new Client({
    connectionString: process.env.DB_STRING
})
client.connect().then(() =>{
    console.log("Postgres is Runnig Now!")
})
.catch((err) => {
    console.log(err)
})

module.exports = client;