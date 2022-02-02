import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/cadastro", async (req, res) => {
  try {
    const userData = req.body
    userData.password = bcrypt.hashSync(req.body.password, 10)
    console.log(userData)
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();

    const dbAPIMyWallet = mongoClient.db("APIMyWallet");
    const usersCollection = dbAPIMyWallet.collection("usuarios");
    const user = await usersCollection.findOne({ email: req.body.email });
    if (user) {
      res.sendStatus(409);
      return;
    }
    await usersCollection.insertOne(userData);
    res.sendStatus(200);
    mongoClient.close();
  } catch {
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.body)
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();

    const dbAPIMyWallet = mongoClient.db("APIMyWallet");
    const usersCollection = dbAPIMyWallet.collection("usuarios");
    const user = await usersCollection.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.sendStatus(200);
    }else{
      res.sendStatus(401);
    }
    // await usersCollection.findOne(userData).toArray();
    // console.log("encontrou")
  } catch {
    res.sendStatus(500);
  }
});

app.listen(5000);
