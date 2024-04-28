const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log("Hello");


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lblkdq0.mongodb.net/your_database_name?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


    await client.connect();
    const myDB = client.db("TourEaseDB");
    const myColl = myDB.collection("Spots");

    app.get('/spots', async (req, res) => {
      const cursor = await myColl.find().toArray();
      res.send(cursor);
    })

    app.get('/spots/:email', async (req, res) => {
      const email = req.params.email;
      console.log('Email:', email);
      const query = { email: email };
      const result = await myColl.find(query).toArray();
      res.send(result);
      console.log(result);
    })

    app.post('/spots', async (req, res) => {
      const spot = req.body;

      console.log('New spot added here', spot);
      const result = await myColl.insertOne(spot);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Place your MongoDB-related code here


  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
