import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from '../database.js';

export async function cadastro(req, res) {
    try {
      const userData = req.body;
      userData.password = bcrypt.hashSync(req.body.password, 10);
  
      const user = await db
        .collection("usuarios")
        .findOne({ email: req.body.email });
      if (user) {
        res.sendStatus(409);
        return;
      }
      await db.collection("usuarios").insertOne(userData);
      res.sendStatus(200);
    } catch {
      res.sendStatus(500);
    }
  }

  export async function login (req, res) {
    try {
      const user = await db
        .collection("usuarios")
        .findOne({ email: req.body.email });
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = uuid();
        await db
          .collection("sessao")
          .insertOne({ token: token, userId: user._id, email: user.email });
        res.send({ token: token, name: user.name });
      } else {
        res.sendStatus(401);
      }
    } catch {
      res.sendStatus(500);
    }
  }