const Pou = require('./pou/pou')
const { Router } = require('express')
const { getIO } = require('./socket')
const DataModel = require('./schemes/data')
const { sendMQTTMessage } = require('./mqtt')


const router = Router()

const pou = new Pou()
console.log("POU CREADO")

setInterval(() => {
    const estado = pou.getStateName()
    new DataModel({
        humedad: 15,
        estado
    }).save()

}, 1000 * 60)

//pou.hablarle("Tu nombre es Feli y eres un robot, podras interactuar normalmente, pero respondiendo segun tus caracteristicas")
//pou.hablarle("Te llamas Feli, eres un robot mascota y estás diseñado para interactuar con los usuarios. Si alguien te pregunta quién eres, responde que eres Feli, un robot mascota amigable. responderas a este prompt:")

router.post('/hablarle', async (req, res) => {
    console.log("HABLARLEE")
    try {
        const text = req.body.text;
        console.log('hablarle: ',text)
        const response = await pou.hablarle(text)
        res.send(response)
    }
    catch(err) {
        console.log(err)
        res.status(503).send()
    }
})

router.post('/revivir', (req, res) => {
    try {
        console.log('REVIVIR')
        pou.revivir()
        res.send()
    }
    catch(err) {
        res.status(503).send()
    }
})

router.post('/dormir', (req, res) => {
    try {
        console.log('DORMIR')
        pou.setDurmiendo(true)
        res.send()
    }
    catch(err) {
        res.status(503).send()
    }
})
router.post('/despertarse', (req, res) => {
    try {
        console.log('DESPERTARSE')
        pou.setDurmiendo(false)
        res.send()
    }
    catch(err) {
        res.status(503).send()
    }
})


router.post('/beber', (req, res) => {
    try {
        console.log('BEBER')
        pou.beber()
        res.send()
    }
    catch(err) {
        res.status(503).send()
    }
})

router.post('/comer', (req, res) => {
    try {
        console.log('COMER')
        pou.alimentar()
        res.send()
    }
    catch(err) {
        res.status(503).send()
    }
})


setInterval(() => {
    pou.cambiarEstado()
    //console.log(`Estado del pou: `, pou.getStateName())
    sendMQTTMessage("actualizar", pou.getStateName())
    const socket = getIO();
    if(socket) {
        socket.emit('estado', pou.getStates())
    }
}, 1000)

module.exports = router