// models/VehicleData.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleDataSchema = new Schema({
  timestamp: { type: String, required: true },
  acceleration: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  gps: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  speed: { type: Number, required: true },
  derivedMetrics: {
    suddenBraking: { type: Boolean, required: true },
    harshAcceleration: { type: Boolean, required: true },
    sharpTurns: { type: Boolean, required: true },
    impactDetection: { type: Boolean, required: true },
  },
});

const VehicleData = mongoose.model("VehicleData", vehicleDataSchema);

module.exports = VehicleData;
