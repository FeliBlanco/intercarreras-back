const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect('mongodb+srv://feliblanco:feliblanco123@cluster0.h0ir0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MONGO DB CONECTADO!')
}

module.exports = connectDB;