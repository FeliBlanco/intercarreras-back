const mongoose = require('mongoose');


const DataScheme = new mongoose.Schema({
    temperatura: {
        type: Number,
        default: 0
    },
    humedad: {
        type: Number,
        default: 0
    },
    estado: {
        type: String
    }
}, {
    timestamps: true
})

const DataModel = mongoose.model('Data', DataScheme);

module.exports = DataModel;