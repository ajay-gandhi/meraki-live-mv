const mqtt = require("mqtt");
const LifxClientCreator = require("node-lifx").Client;

const MV_SERIAL = "Q2GV-EJAN-C944";
const LIGHT_IP = "192.168.128.122";
const MAX_POP = 15;
const MAX_HUE = 120;
const MAX_BRIGHT = 20;
const COLOR_FADE_DURATION = 300; // ms

const lifxClient = new LifxClientCreator();

lifxClient.init();

console.log("Starting...");
lifxClient.on("light-new", (light) => {
  if (light.address === LIGHT_IP) {
    console.log("Found light");

    // Assume MQTT server is running locally
    const mqttClient = mqtt.connect("mqtt://localhost");

    mqttClient.on("connect", () => {
      console.log("MQTT connected");
      mqttClient.subscribe(`/merakimv/${MV_SERIAL}/raw_detections`, function (err) {
        if (!err) {
          console.log("MQTT error", err);
        }
      })
    });

    mqttClient.on("message", (topic, message) => {
      const population = JSON.parse(message.toString()).objects.length;
      const hue = cap(MAX_HUE, 0, MAX_HUE - (population * MAX_HUE / MAX_POP));
      const brightness = cap(MAX_BRIGHT, 0, population * MAX_BRIGHT / MAX_POP);
      console.log(`${population} people, changing to hue ${hue}, brightness ${brightness}`);
      light.color(hue, 100, brightness, undefined, COLOR_FADE_DURATION);
    });

    process.on("exit", () => { mqttClient.end(); });
  }
});

const cap = (mx, mn, v) => Math.min(mx, Math.max(mn, v));
