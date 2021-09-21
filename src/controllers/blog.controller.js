// models
import HeartRate from "../models/heartRate.model";
import Accelerometer from "../models/accelerometer.model";
import Barometer from "../models/barometer.model";
import Geolocation from "../models/geolocation.model";
import Sleep from "../models/sleep.model";
import Orientation from "../models/orientation.model";
import Gyroscope from "../models/gyroscope.model";

import { validInputBlog } from "../validators";
import { DATA_TYPES } from "../helpers/constans";

const list = async (req, res) => {
  try {
    results = await BlogModel.find();
    res.json(blogs);
  } catch (error) {
    res.status(400).json(error);
  }
};

const create = async (req, res) => {
  try {
    const input = req.body;
    const { id: userId } = req.user;
    let result;
    const { type } = input;
    switch (type) {
      case DATA_TYPES.HEART_RATE: {
        result = await HeartRate.create({ ...input, userId });
        break;
      }
      case DATA_TYPES.ACCELEMETER: {
        result = await Accelerometer.create({ ...input, userId });
        break;
      }
      case DATA_TYPES.BAROMETER: {
        result = await Barometer.create({ ...input, userId });
        break;
      }
      case DATA_TYPES.GEOLOCATION: {
        result = await Geolocation.create({ ...input, userId });
        break;
      }
      case DATA_TYPES.SLEEP: {
        result = await Sleep.create({ ...input, userId });
        break;
      }
      case DATA_TYPES.SLEEP: {
        result = await Sleep.create({ ...input, userId });
        break;
      }
      case DATA_TYPES.ORIENTATION: {
        result = await Orientation.create({ ...input, userId });
        break;
      }
      case DATA_TYPES.GYROSCOPE: {
        result = await Gyroscope.create({ ...input, userId });
        break;
      }
    }

    res.status(200);
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  list,
  create
};
