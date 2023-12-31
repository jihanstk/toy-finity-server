const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    // await client.connect();
    // data base collection

    const toyCollection = client.db("toysDB").collection("toy");

    // get all toys form db
    app.get("/all-toys", async (req, res) => {
      const result = await toyCollection.find().limit(20).toArray();
      res.send(result);
    });
    app.get("/sort-by-price", async (req, res) => {
      const sortType = req.query.sort;
      console.log(sortType);
      const result = await toyCollection
        .find()
        .sort({ price: sortType })
        .toArray();
      res.send(result);
    });
    app.get("/all-toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(filter);
      res.send(result);
    });
    app.get("/all-toy", async (req, res) => {
      const search = req.query;
      console.log(search);
      const filter = { toyName: search.toyName };
      const result = await toyCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/category-data", async (req, res) => {
      const category = req.query;
      console.log(category);
      const filter = { category: category.category };
      const result = await toyCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/category-list", async (req, res) => {
      // const category = req.query;
      // console.log(category);
      const filter = { category: category.category };
      const result = await toyCollection.find().toArray();
      res.send(result);
    });
    // get Toy by email
    app.get("/my-toys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = {
          email: req.query.email,
        };
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/my-toys/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
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
        price: parseFloat(toy.price),
        rating: toy.rating,
        quantity: toy.quantity,
        details: toy.details,
        email: toy.email,
      };
      const result = await toyCollection.insertOne(toyDoc);
      res.send(result);
    });
    app.patch("/update-toy/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      console.log(id, updated);
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          price: parseFloat(updated.price),
          quantity: updated.quantity,
          details: updated.details,
        },
      };
      const result = await toyCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.delete("/my-toys/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(filter);
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
