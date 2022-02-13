require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const LocationSchema = require("./models/Location");
const cors = require("cors");
const app = express();
app.use(cors());

app.use(express.json());

app.post("/", async function (req, res) {
  const { name, coordinates, userID } = req.body;

  const locationData = new LocationSchema({
    name,
    userID,
    location: {
      type: "Point",
      coordinates: coordinates,
    },
  });
  try {
    await locationData.save();
    res.send(locationData);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
app.get("/", async function (req, res) {
  try {
    const data = await LocationSchema.find({});
    res.send(data);
  } catch (err) {
    res.json({ message: err });
  }
});

app.post("/me", async (req, res) => {
  const { userID } = req.body;
  if (!userID) return res.status(400).json({ message: "User ID not passed" });
  try {
    const data = await LocationSchema.find({
      userID,
    });
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

app.get("/find", async (req, res) => {
  //   if (!req.query.latitude || !req.query.longitude) {
  //     res.send({
  //       error: "Latitude and longitude are required",
  //     });
  //     return;
  //   }
  const paramCheck = () => {
    if (!req.query.latitude || !req.query.longitude) {
      return {};
    } else {
      return {
        location: {
          $geoWithin: {
            $centerSphere: [
              [req.query.longitude, req.query.latitude],
              (50 * 1.60934) / 3963.2,
            ],
          },
        },
      };
    }
  };
  try {
    const data = await LocationSchema.find(paramCheck());
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => {
  console.log("Connected to DB!");
  app.listen(process.env.PORT, () => console.log("Server Up and running"));
});
