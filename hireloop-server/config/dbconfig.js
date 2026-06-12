const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("hireLoop-jobs");
const db_hireLoop = client.db("hireLoop");

module.exports = {
  client,
  db,
  db_hireLoop
};
