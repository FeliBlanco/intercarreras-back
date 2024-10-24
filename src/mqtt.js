const mqtt = require("mqtt");

const client = mqtt.connect({
    port: 8883,
    host: '748e26d3a6294ca0a7d11cf94a6c8002.s1.eu.hivemq.cloud',
    protocol: 'mqtts',
    username: 'Maximo',
    password: 'Mascota2024'
});

client.on("connect", () => {
  client.subscribe("hola", (err) => {
    if (!err) {
      client.publish("hola", "Hello mqtt");
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

module.exports = client