const express = require('express');
const cors = require('cors');   
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lblkdq0.mongodb.net/your_database_name?retryWrites=true&w=majority&appName=Cluster0`;

async function run() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // Place your MongoDB-related code here
    
    await client.close();
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
