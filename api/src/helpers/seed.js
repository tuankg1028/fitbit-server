import path from 'path'
import fs from 'fs'
import moment from 'moment'
import HeartRate from '../models/heartRate.model'
import User from '../models/user.model'
var glob = require("glob")
const SEAL = require('node-seal')

const getFilesWithWildcard = (wildcard) => {
  return new Promise((resolve, reject) => {
    glob(wildcard, {}, function (er, files) {
      if(er) reject(er)
      // files is an array of filenames.
      // If the `nonull` option is set, and nothing
      // was found, then files is ["**/*.js"]
      // er is an error object or null.
      resolve(files)
    })
    
  })
} 

const heartRate = async () => {
  const wildcard = path.join(__dirname, "../../public/data/MyFitbitData/SonHaXuan/Physical Activity/heart_rate-*.json")
  const files = await getFilesWithWildcard(wildcard)
  console.log("files", files)

  for (const file of files) {
    console.log(file)
    const jsonText = await fs.readFileSync(file, "utf8")
    var jsonData = JSON.parse(jsonText);
    await Promise.all(jsonData.map(row => {

      const timestamp = moment.utc(row.dateTime, "MM/DD/YY HH:mm:ss").valueOf()
      const heartRate = row.value.bpm

      console.log(timestamp, heartRate, row.dateTime)
      return HeartRate.create({
        timestamp,
        heartRate
      })
    }))
  }
}
// heartRate()

const encryptHeartRate = async () => {
  const user = await User.findOne()
  const heartRateData = await HeartRate.find().limit(4000)
  const heartRateData2 = heartRateData.splice(0, 2000)
   
  // ES6 or CommonJS
  // import SEAL from 'node-seal'
  // const SEAL = require('node-seal')

  // Using CommonJS for RunKit
  console.time('Init key')
  const SEAL = require('node-seal')
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

  const encoder = seal.BatchEncoder(context)
  const UploadedPublicKey = seal.PublicKey()
  UploadedPublicKey.load(context, user.publicKey)

  const UploadedSecretKey = seal.SecretKey()
  UploadedSecretKey.load(context, user.secretKey)
  const encryptor = seal.Encryptor(context, UploadedPublicKey)
  const decryptor = seal.Decryptor(context, UploadedSecretKey)
  const evaluator = seal.Evaluator(context)


  const keyGenerator = seal.KeyGenerator(context)
  const relinKey = keyGenerator.createRelinKeys()

  console.timeEnd('Init key')

  const data = heartRateData.reduce((acc, item)=> {
    acc.push(item.heartRate)
    return acc
   }, [])

   const data2 = heartRateData2.reduce((acc, item)=> {
    acc.push(item.heartRate)
    return acc
   }, [])

  //  console.log(1, data)
  //  console.log(1, data2)

   console.time('Encrypt')
   // Create data to be encrypted
   const array = Int32Array.from(data)

   const array2 = Int32Array.from(data2)

   // Encode the Array
   const plainText = encoder.encode(array)
 
   // Encrypt the PlainText
   const cipherText = encryptor.encrypt(plainText)

   // Encode the Array
   const plainText2 = encoder.encode(array2)
 
   // Encrypt the PlainText
   const cipherText2 = encryptor.encrypt(plainText2)
   console.timeEnd('Encrypt')

   console.time('CalculateWithAdd')
   // Add the CipherText to itself and store it in the destination parameter (itself)
   const cipherTextResult = evaluator.add(cipherText, cipherText2) // Op (A), Op (B), Op (Dest)
   console.timeEnd('CalculateWithAdd')

   console.time('CalculateWithSub')
   // Add the CipherText to itself and store it in the destination parameter (itself)
   const cipherTextResultSub = evaluator.sub(cipherText, cipherText2) // Op (A), Op (B), Op (Dest)
   console.timeEnd('CalculateWithSub')

   console.time('CalculateWithMultiply')
   // Add the CipherText to itself and store it in the destination parameter (itself)
   evaluator.multiply(cipherText, cipherText2) // Op (A), Op (B), Op (Dest)
   console.timeEnd('CalculateWithMultiply')

   console.time('CalculateWitsSquare')
   // Add the CipherText to itself and store it in the destination parameter (itself)
   evaluator.square(cipherText) // Op (A), Op (B), Op (Dest)
   console.timeEnd('CalculateWitsSquare')

   console.time('CalculateWithNegate')
   // Add the CipherText to itself and store it in the destination parameter (itself)
   evaluator.square(cipherText) // Op (A), Op (B), Op (Dest)
   console.timeEnd('CalculateWithNegate')

   console.time('CalculateWithExponentiate')
   // Add the CipherText to itself and store it in the destination parameter (itself)
   evaluator.exponentiate(cipherText, 3, relinKey) // Op (A), Op (B), Op (Dest)
   console.timeEnd('CalculateWithExponentiate')

   // Or create return a new cipher with the result (omitting destination parameter)
   // const cipher2x = evaluator.add(cipherText, cipherText)
 
   console.time('Decrypt')
   // Decrypt the CipherText
   const decryptedPlainText = decryptor.decrypt(cipherTextResult)
 
   // Decode the PlainText
   const decodedArray = encoder.decode(decryptedPlainText)
   console.timeEnd('Decrypt')

   console.log('decodedArray', decodedArray)
}
// encryptHeartRate()



