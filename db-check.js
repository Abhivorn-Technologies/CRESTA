const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/cresta'); // Wait, let me check .env for URI
}
