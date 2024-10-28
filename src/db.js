const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect('mongodb+srv://feliblanco:feliblanco123@cluster0.h0ir0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    //await mongoose.connect('mongodb://atlas-sql-671ac3a951fe861d5202cb75-h0ir0.a.query.mongodb.net/test?ssl=true&authSource=admin');
    console.log('MONGO DB CONECTADO!')
}

module.exports = connectDB;