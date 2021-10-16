import SEAL from 'node-seal'
import _ from 'lodash'
import moment from 'moment'
// models
import HeartRate from "../models/heartRate.model";
import User from "../models/user.model";
import Accelerometer from "../models/accelerometer.model";
import Barometer from "../models/barometer.model";
import Geolocation from "../models/geolocation.model";
import Sleep from "../models/sleep.model";
import Orientation from "../models/orientation.model";
import Gyroscope from "../models/gyroscope.model";
import EncyptedData from '../models/encypted-data.model'

import { validInputBlog } from "../validators";
import { DATA_TYPES } from "../helpers/constans";

const getAll = async (req, res) => {
  try {
    let result;
    const { type, pagination = {} } = req.query;
    
    console.log("Step 0 :: Get sensor with type :: ", type)
    switch (type) {
      case DATA_TYPES.HEART_RATE: {

        result = await HeartRate.find().limit(pagination.limit || 1000).sort(['id', 1]);
        break;
      }
      case DATA_TYPES.ACCELEMETER: {
        result = await Accelerometer.find();
        break;
      }
      case DATA_TYPES.BAROMETER: {
        result = await Barometer.find();
        break;
      }
      case DATA_TYPES.GEOLOCATION: {
        result = await Geolocation.find();
        break;
      }
      case DATA_TYPES.SLEEP: {
        result = await Sleep.find();
        break;
      }
      case DATA_TYPES.SLEEP: {
        result = await Sleep.find();
        break;
      }
      case DATA_TYPES.ORIENTATION: {
        result = await Orientation.find();
        break;
      }
      case DATA_TYPES.GYROSCOPE: {
        result = await Gyroscope.find();
        break;
      }
    }

    console.log(1,result)
    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
};

const create = async (req, res) => {
  try {
    const input = req.body;
    console.log("Create data :: input", input)
    const { id: userId } = req.user || {};
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
    res.status(400).json({message: error.message});
  }
};

const createEncryptedData = async (req, res) => {
  try {
    const input = req.body;
    const { encryptedData } = input
    // get user
    const user = await User.findOne()
    const { id: userId } = user || {};
    const result = await EncyptedData.create({...encryptedData, userId})
    
    return res.json(result);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};
const getEncryptedData = async (req, res) => {
  try {
    const user = await User.findOne({email: 'lethanhtuan1028@gmail.com'})
    // encryption
    const seal = await SEAL()
    const schemeType = seal.SchemeType.bfv
    const securityLevel = seal.SecurityLevel.tc128
    const polyModulusDegree = 4096
    const bitSizes = [36, 36, 37]
    const bitSize = 20

    const parms = seal.EncryptionParameters(schemeType)

    // Set the PolyModulusDegree
    parms.setPolyModulusDegree(polyModulusDegree)

    // Create a suitable set of CoeffModulus primes
    parms.setCoeffModulus(
      seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
    )

    // Set the PlainModulus to a prime of bitSize 20.
    parms.setPlainModulus(
      seal.PlainModulus.Batching(polyModulusDegree, bitSize)
    )
    const context = seal.Context(
      parms, // Encryption Parameters
      true, // ExpandModChain
      securityLevel // Enforce a security level
    )

    if (!context.parametersSet()) {
      throw new Error(
        'Could not set the parameters in the given context. Please try different encryption parameters.'
      )
    }
    
    const UploadedPublicKey = seal.PublicKey()
    UploadedPublicKey.load(context, user.publicKey)
    
    const UploadedSecretKey = seal.SecretKey()
    UploadedSecretKey.load(context, user.secretKey)
    const evaluator = seal.Evaluator(context)

    //
    const { pagination = {} } = req.query;

    console.time("Mongodb get data")
    let result = await EncyptedData.find({
      createdAt: { $gte: moment().subtract(48, "hours")}
    }).limit(pagination.limit || 1000).sort({'createdAt': "desc"})
    console.timeEnd("Mongodb get data")
    const resultSum = []

    console.time("HE Evaluator")
    // result = _.groupBy(result, (item) =>  moment(item.createdAt).format('YYYY-MM-DD hh a'))
    // for (const key in result) {
    //   const valuesByHour = result[key]
      
    //   const sum = valuesByHour.reduce((acc, item, index) => {
    //     if(index === 0) return acc = {
    //       ...item.toJSON(),
    //       totalRow: valuesByHour.length
    //     }

    //     const cipherText1 = seal.CipherText()
    //     cipherText1.load(context, item.value) 

    //     const cipherText2 = seal.CipherText()
    //     cipherText2.load(context, acc.value) 

    //     return {
    //       ...acc,
    //       value: evaluator.add(cipherText2, cipherText1).save()
    //     } 
    //   }, null)

    //   resultSum.push(sum)
    // }
    console.timeEnd("HE Evaluator")
   
    res.json(resultSum);
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
};
export default {
  getAll,
  create,
  createEncryptedData,
  getEncryptedData
};

