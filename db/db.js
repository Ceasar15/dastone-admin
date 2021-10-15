const { Client } = require("pg")
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