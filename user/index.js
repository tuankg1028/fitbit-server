const moment = require('moment');
const SEAL = require('node-seal')
var math = require( 'mathjs' );
const _ = require('lodash')

const { getRawData, getProfile, createEncryptedData, getEncryptedData } = require('./services/server')
const { randomIntFromInterval } = require('./helpers/random')
const { encryptAES, decryptAES } = require('./helpers/crypto')
async function encryptInternal() {
  const user = await getProfile('lethanhtuan1028@gmail.com')
  // const heartRate = await getRawData('heartRate');

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
  
  const encoder = seal.BatchEncoder(context)
  const UploadedPublicKey = seal.PublicKey()
  UploadedPublicKey.load(context, user.publicKey)
  
  const UploadedSecretKey = seal.SecretKey()
  UploadedSecretKey.load(context, user.secretKey)
  const encryptor = seal.Encryptor(context, UploadedPublicKey)
  const decryptor = seal.Decryptor(context, UploadedSecretKey)
  const evaluator = seal.Evaluator(context)

  console.time("HE Encrypt")
  // heart rate, calo, step, distance
  const array = [randomIntFromInterval(60, 130), randomIntFromInterval(20, 100), randomIntFromInterval(20, 200), randomIntFromInterval(5, 40)]
  
   // Create data to be encrypted
   const data = Int32Array.from(array)

   // Encode the Array
   const plainText = encoder.encode(data)
 
   // Encrypt the PlainText
   const dataCiperText = encryptor.encrypt(plainText)
   console.timeEnd("HE Encrypt")

   // Create data to be encrypted
  //  console.time("AES Encrypt")
   const header = encryptAES(moment().unix().toString(), user.aesKey)
  //  console.timeEnd("AES Encrypt")

   await createEncryptedData({
    encryptedData: {
      header,
      value: dataCiperText.save()
    }
   })
}
setInterval(() => {
  encryptInternal()
}, 1000 * 60)

async function syncProvider() {
  const user = await getProfile('lethanhtuan1028@gmail.com')
  // const heartRate = await getRawData('heartRate');

  // encryption
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
  const decryptor = seal.Decryptor(context, UploadedSecretKey)

  
  const encryptedData = await getEncryptedData()
  console.time("HE Decrypt")
  const rawData = encryptedData.map(item => {
    const cipherText = seal.CipherText()
    cipherText.load(context, item.value)
    const valuePlainText = decryptor.decrypt(cipherText)
    const decodedValue = encoder.decode(valuePlainText)
    
    const timestamp = decryptAES(Buffer.from(item.header, "base64"), user.aesKey)
    // heart rate, calo, step, distance
    return {
      id: item.id,
      heartRate: decodedValue[0] / item.totalRow,
      calory: decodedValue[1],
      steps: decodedValue[2],
      distance: decodedValue[3],
      createdAt: item.createdAt
    }
  })

  const result = {
    data: rawData,
    variance: {
      heartRate: math.variance(_.map(rawData, 'heartRate')),
      calory: math.variance(_.map(rawData, 'calory')),
      steps: math.variance(_.map(rawData, 'steps')), 
      distance: math.variance(_.map(rawData, 'distance'))
    },  
    std: {
      heartRate: math.std(_.map(rawData, 'heartRate')),
      calory: math.std(_.map(rawData, 'calory')),
      steps: math.std(_.map(rawData, 'steps')), 
      distance: math.std(_.map(rawData, 'distance'))
    }
  }

  console.timeEnd("HE Decrypt")
  console.log(result)
}
// syncProvider()