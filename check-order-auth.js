const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://arunajyothi:Aruna1234567@cluster0-shard-00-00.urgk8.mongodb.net:27017,cluster0-shard-00-01.urgk8.mongodb.net:27017,cluster0-shard-00-02.urgk8.mongodb.net:27017/cresta_global?ssl=true&replicaSet=atlas-13wrt9-shard-0&authSource=admin&appName=Cluster0');
  
  const Order = mongoose.connection.collection('orders');
  const order = await Order.findOne({ _id: new mongoose.Types.ObjectId('6a8570eb82a4bc7f3ef22980') });
  
  console.log("userId:", order?.userId);
  console.log("sessionId:", order?.sessionId);
  process.exit(0);
}

test().catch(console.error);
