// Connects to database
import { MongoClient } from 'mongodb';

let db;

async function connectToDb(cb) {
    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@dnd-character-cluster.fflzpzw.mongodb.net/?retryWrites=true&w=majority&appName=DND-Character-Cluster`);
    await client.connect();
    db = client.db('dnd-db');
    cb();
}

export {
    db,
    connectToDb,
};
