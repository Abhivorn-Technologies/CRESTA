const mongoose = require('mongoose');
require('dotenv').config({path: '.env.local'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const orders = await db.collection('orders').find({orderStatus: {$ne: 'cancelled'}}).toArray();
  console.log('Total orders:', orders.length);
  const sum = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  console.log('Total sales:', sum);
  const theOrder = orders.find(o => o._id.toString() === '6a926d2abe7b70be4eaf6c33');
  console.log('The specific order:', theOrder);
  mongoose.disconnect();
});
