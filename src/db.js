const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect('mongodb://127.0.0.1:27017/pou');
    console.log('MONGO DB CONECTADO!')
}

module.exports = connectDB;