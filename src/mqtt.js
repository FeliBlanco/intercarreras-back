const mqtt = require("mqtt");
const { cambiarAmbiente } = require("./pou/pou");

const client = mqtt.connect('http://broker.emqx.io');

client.on("connect", () => {
  console.log("Connected");
  client.subscribe("temperatura", (err) => {
    if (!err) {
      client.publish("actualizar", "Hello mqtt");
    } else {
        console.log(err)
    }
  });
});

client.on("message", (topic, message) => {
  try {
    switch(topic) {
      case "temperatura": {
        const decode = JSON.parse(message);
        cambiarAmbiente("temperatura", decode.temperatura)
        console.log("CAMBIAR TMP")
        break;
      }
    }
  }
  catch(err) {
    console.log(err)
  }
});

function sendMQTTMessage(topic, message) {
  if(client) {
    client.publish(topic, message);
  }
}

module.exports = {
  sendMQTTMessage
}