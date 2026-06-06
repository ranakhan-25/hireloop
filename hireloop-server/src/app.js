require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { client } = require("../config/dbConfig");
const jobRouter = require("../router/jobRouter");


const app = express();
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect()
    
    app.use(jobRouter)


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "server running successfully",
  });
});

module.exports = app;
