const { MongoClient } = require('mongodb');

const uri = "mongodb://arunajyothi:Aruna1234567@cluster0-shard-00-00.urgk8.mongodb.net:27017,cluster0-shard-00-01.urgk8.mongodb.net:27017,cluster0-shard-00-02.urgk8.mongodb.net:27017/cresta_global?ssl=true&replicaSet=atlas-13wrt9-shard-0&authSource=admin&appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("cresta_global");
    const wishlists = database.collection("wishlists");
    const wishlistList = await wishlists.find({}).toArray();
    
    console.log("--- START WISHLISTS ---");
    console.log(JSON.stringify(wishlistList, null, 2));
    console.log("--- END WISHLISTS ---");
    
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
