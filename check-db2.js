const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://arunajyothi:Aruna1234567@cluster0-shard-00-00.urgk8.mongodb.net:27017,cluster0-shard-00-01.urgk8.mongodb.net:27017,cluster0-shard-00-02.urgk8.mongodb.net:27017/cresta_global?ssl=true&replicaSet=atlas-13wrt9-shard-0&authSource=admin&appName=Cluster0');
  
  const orderSchema = new mongoose.Schema({
    refundDetails: mongoose.Schema.Types.Mixed
  }, { strict: false });
  
  const Order = mongoose.model('Order', orderSchema);
  
  const order = await Order.findById('6a8570eb82a4bc7f3ef22980');
  console.log("refundDetails:", order?.refundDetails);
  
  process.exit(0);
}

test().catch(console.error);
