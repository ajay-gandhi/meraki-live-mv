# Meraki Live MV

This repo contains code for a sample app using Meraki's live MV API with LIFX
bulbs. This app demonstrates basic functionality of both APIs by scaling the
brightness of the LIFX bulb according to population density:

```
population:  0              ->              20
light:       green, dim     ->     red, bright
```

## Requirements

* `mosquitto` must be installed
* The MV camera must be able to access the mqtt server, and be configured as
  such in Dashboard
* The LIFX bulb must be configured on the same network as this app

## Running

First, run the MQTT server:

```bash
$ /usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf
```

Install npm packages and run:

```bash
$ npm install
$ node app.js
```

