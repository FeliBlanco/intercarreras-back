const mqtt = require("mqtt");

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
  switch(topic) {
    case "cambiar_temperatura": {
      
      break;
    }
  }
  console.log(topic)
  try {
    const json_decode = JSON.parse(message);
    console.log(json_decode)
  }
  catch(err) {
    console.log("ERROR AL LEER JSON")
  }
  console.log(message.toString());
});

function sendMQTTMessage(topic, message) {
  if(client) {
    client.publish(topic, message);
  }
}

module.exports = {
  sendMQTTMessage
}