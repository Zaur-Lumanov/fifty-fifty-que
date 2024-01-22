import {MongoClient} from "mongodb";

const url = "mongodb://127.0.0.1:27017/";
export const mongoClient = new MongoClient(url);
export const _db = mongoClient.db("dicebot");
const db = {
  ..._db,
  get orders() {
    return _db.collection('orders');
  },
  get users() {
    return _db.collection('users');
  },
};

export default db;
