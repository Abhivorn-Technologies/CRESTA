const mongoose = require('mongoose');
require('dotenv').config({path: '.env.local'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - 7);
  
  const currentOrders = await db.collection('orders').find({ createdAt: { $gte: startDate, $lte: now } }).toArray();
  const theOrder = currentOrders.find(o => o._id.toString() === '6a926d2abe7b70be4eaf6c33');
  
  const calculateSales = (orders) => orders.filter(o => o.orderStatus !== "cancelled").reduce((sum, o) => sum + o.totalAmount, 0);
  console.log('Total with order:', calculateSales(currentOrders));
  console.log('Total WITHOUT order:', calculateSales(currentOrders.filter(o => o._id.toString() !== '6a926d2abe7b70be4eaf6c33')));
  mongoose.disconnect();
});
