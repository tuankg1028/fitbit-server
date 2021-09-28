// models
import HeartRate from "../models/heartRate.model";
import Accelerometer from "../models/accelerometer.model";
import Barometer from "../models/barometer.model";
import Geolocation from "../models/geolocation.model";
import Sleep from "../models/sleep.model";
import Orientation from "../models/orientation.model";
import Gyroscope from "../models/gyroscope.model";
import User from "../models/user.model";

import { validInputBlog } from "../validators";
import { DATA_TYPES } from "../helpers/constans";

const updateSecretKey = async (req, res) => {
  try {
    const { secretKey } = req.body;

    const user = await User.updateOne({}, {
      secretKey
    })
    
   
    res.json(user);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

export default {
  updateSecretKey
};
