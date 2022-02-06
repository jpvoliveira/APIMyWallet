import db from "../database.js";

export async function enviarEntrada(req, res) {
  try {
    const inputData = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    const session = await db.collection("sessao").findOne({ token });
    if (!session) return res.sendStatus(401);

    await db
      .collection("extratos")
      .insertOne({ ...inputData, email: session.email });

    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}

export async function enviarSaida(req, res) {
  try {
    const outputData = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    const session = await db.collection("sessao").findOne({ token });
    if (!session) return res.sendStatus(401);

    await db
      .collection("extratos")
      .insertOne({ ...outputData, email: session.email });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}

export async function buscarExtrato(req, res) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    const session = await db.collection("sessao").findOne({ token });
    if (!session) return res.sendStatus(401);

    const extrato = await db
      .collection("extratos")
      .find({ email: session.email })
      .toArray();
    res.send(extrato);
  } catch {
    res.sendStatus(500);
  }
}
