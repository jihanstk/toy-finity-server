const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
const app = express();

const port = process.env.PORT || 5021;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.TOY_USER}:${process.env.TOY_PASS}@cluster0.h6deoil.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("toysDB").collection("toy");
    app.get("/all-car", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });
    app.post("/add-toy", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const toyDoc = {
        toyName: toy.toyName,
        photo: toy.photo,
        seller: toy.seller,
        category: toy.category,
        price: toy.price,
        rating: toy.rating,
        quantity: toy.quantity,
        details: toy.details,
      };
      const result = await toyCollection.insertOne(toyDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toys Infinity is running server");
});

app.listen(port, () => {
  console.log(`toys is running on ${port}`);
});
