const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const CountryColl = myDB.collection("Countries");
    const deshColl = myDB.collection("Country");
    const Country_Coll = myDB.collection("Country_Name");

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
      console.log(result)
    })
    app.get('/spots/Countries/:countryName', async (req, res) => {
      const countryName = req.params.countryName;
      console.log('Country:', countryName);
      const query = { countryName: countryName };
      const result = await myColl.find(query).toArray();
      res.send(result);
      console.log(result)
    })

    app.get('/spots/id/:id', async (req, res) => {
      const id = req.params.id;
      console.log('ID:', id);
      const query = { _id: new ObjectId(id) };
      const result = await myColl.find(query).toArray();
      res.send(result);
    })


    app.get('/sort', async (req, res) => {
      const cursor = await myColl.find().sort({ averageCost: 1 }).toArray();
      res.send(cursor);
    });

    app.get('/Country_name', async (req, res) => {
      const cursor = await Country_Coll.find().toArray();
      res.send(cursor);
      console.log(cursor);
    })



    app.delete('/spots/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myColl.deleteOne(query);
      res.send(result);
      console.log(result)
    });



    app.post('/spots/Countries', async (req, res) => {
      const country = req.body;

      console.log('New country added here', country);
      const result = await myColl.insertOne(country);
      res.send(result);
    })

    app.post('/spots', async (req, res) => {
      const spot = req.body;

      console.log('New spot added here', spot);
      const result = await myColl.insertOne(spot);
      res.send(result);
    })

    app.post('/Country_name', async (req, res) => {
      const {countries} = req.body;


      const result = await Country_Coll.insertMany([
        countries

      ]);
      res.send(result);
      console.log(result);


    });

    app.put('/spots/id/:id', async (req, res) => {
      const id = req.params.id;
      const updatedSpot = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          Image: updatedSpot.Image,
          spotName: updatedSpot.spotName,
          countryName: updatedSpot.countryName,
          location: updatedSpot.location,
          description: updatedSpot.description,
          averageCost: updatedSpot.averageCost,
          season: updatedSpot.season,
          time: updatedSpot.time,
          visitors: updatedSpot.visitors,
          Name: updatedSpot.Name,
          email: updatedSpot.email,
        },
      };
      const result = await myColl.updateOne(query, updateDoc);
      res.send(result);
    });





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
