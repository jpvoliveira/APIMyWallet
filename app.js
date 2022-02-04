import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/cadastro", async (req, res) => {
  try {
    const userData = req.body;
    userData.password = bcrypt.hashSync(req.body.password, 10);
    
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
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();

    const dbAPIMyWallet = mongoClient.db("APIMyWallet");
    const usersCollection = dbAPIMyWallet.collection("usuarios");
    const sessaoCollection = dbAPIMyWallet.collection("sessao");
    const user = await usersCollection.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = uuid()
      await sessaoCollection.insertOne({token: token, userId: user._id, email: user.email})
      res.send({token:token, name:user.name});
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.post("/entrada", async (req, res) => {
  try {
    const inputData = req.body;
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    const dbAPIMyWallet = mongoClient.db("APIMyWallet");

    const extratosCollection = dbAPIMyWallet.collection("extratos");
    const sessaoCollection = dbAPIMyWallet.collection("sessao");

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
  
    if(!token) return res.sendStatus(401);

    const session = await sessaoCollection.findOne({ token });
    if (!session) return res.sendStatus(401);

    const extrato = await extratosCollection.insertOne({ ...inputData, email: session.email });
    
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.post("/saida", async (req, res) => {
  try {
    const outputData = req.body;
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    const dbAPIMyWallet = mongoClient.db("APIMyWallet");

    const extratosCollection = dbAPIMyWallet.collection("extratos");
    const sessaoCollection = dbAPIMyWallet.collection("sessao");

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
  
    if(!token) return res.sendStatus(401);

    const session = await sessaoCollection.findOne({ token });
    if (!session) return res.sendStatus(401);

    const extrato = await extratosCollection.insertOne({ ...outputData, email: session.email });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.get("/menu", async (req, res) => {
  try {
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    const dbAPIMyWallet = mongoClient.db("APIMyWallet");
    
    const sessaoCollection = dbAPIMyWallet.collection("sessao");
    const extratosCollection = dbAPIMyWallet.collection("extratos");

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
  
    if(!token) return res.sendStatus(401);

    const session = await sessaoCollection.findOne({ token });
    if (!session) return res.sendStatus(401);


    const extrato = await extratosCollection.find({ email: session.email }).toArray();
    res.send(extrato);
  } catch {
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT);
