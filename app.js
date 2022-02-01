import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/cadastro", async (req, res) => {
  try {
      const userData ={
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
      }
    console.log(req.body);
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();

    const dbAPIMyWallet = mongoClient.db("APIMyWallet");
    const usersCollection = dbAPIMyWallet.collection("usuarios");
    const user = await usersCollection.findOne({email: req.body.email});
    if (user) {
      res.sendStatus(409);
      return;
    }
    await usersCollection.insertOne(userData)
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.listen(5000);
