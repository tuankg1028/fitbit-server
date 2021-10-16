import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import Sidebar from '../Sidebar';
import agent from '../../agent';
import { connect } from 'react-redux';
import SEAL from 'node-seal'

// 
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER,
  CHANGE_TAB,
  PROFILE_PAGE_LOADED
} from '../../constants/actionTypes';
import { DATA_TYPE } from '../../constants'

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  sidebarTab: state.home.sidebarTab,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (sidebarTab, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, sidebarTab, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED }),
  changeSidebarTab: tab => 
    dispatch({  type: CHANGE_TAB, tab }),

});

const encrypteData = async ( data) => {
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

  const keyGenerator = seal.KeyGenerator(context)

  const publicKey = keyGenerator.createPublicKey()
  const secretKey = keyGenerator.secretKey()
  // const UploadedSecretKey = seal.SecretKey()
  // UploadedSecretKey.load(context, secretKey)
  // const UploadedPublicKey = seal.PublicKey()
  // UploadedPublicKey.load(context, publicKey)

  const encoder = seal.BatchEncoder(context)
  const encryptor = seal.Encryptor(context, publicKey)
  const decryptor = seal.Decryptor(context, secretKey)
    
  const array = Int32Array.from(Array.from({length: 409}, (_, i) => i))

  // Encode the Array
  const plainText = encoder.encode(array)

    // Encrypt the PlainText
  const cipherText = encryptor.encrypt(plainText)

  const decryptedPlainText = decryptor.decrypt(cipherText)
  const decodedArray = encoder.decode(decryptedPlainText)
 
  console.log(1, cipherText.save())
  return cipherText
}
const encryptDataInterVal = async (props) => {
  const [heartRateData] = await Promise.all([
    agent.Data.getAll(DATA_TYPE.HEART_RATE)
  ])

  encrypteData()

  // console.log(2, UploadedSecretKey.save())

  // const encryptor = seal.Encryptor(context, publicKey)
  // const decryptor = seal.Decryptor(context, secretKey)
  // const evaluator = seal.Evaluator(context)
  
  
  // const array = Int32Array.from([1, -2, 3, 4])
  // Encode the Array
  // const plainText = encoder.encode(array)

  // // Encrypt the PlainText
  // 

 
  // evaluator.negate(cipherText, cipherText, )
  


  // const decryptedPlainText = decryptor.decrypt(cipherText)

  // // // Decode the PlainText
  // const decodedArray = encoder.decode(decryptedPlainText)
  // console.log(222, decodedArray[0], decodedArray[1], decodedArray[2])

  // if(props.data) {
  
  //   for (let i = 0; i < props.data.length; i++) {
  //     const item = props.data[i];
  //     // Create data to be encrypted
  //     const array = Int32Array.from([item])

  //     // Encode the Array
  //     const plainText = encoder.encode(array)

  //      // Encrypt the PlainText
  //     const cipherText = encryptor.encrypt(plainText)

  //     agent.Data.storeEncryptedData({
  //       cipherText: cipherText.save(),
  //       type: props.sidebarTab,
  //       timestamp: item.timestamp
  //     })
  //   }
  // }
 
  // var intervalId = setInterval(() => {
  //   console.log(1)
  // }, 1000);
  // // store intervalId in the state so it can be accessed later:
  // this.setState({intervalId: intervalId});
}
class Home extends React.Component {
  componentWillMount() { 
    const { dataType } = this.props.match.params
    const sidebarTab = dataType && Object.values(DATA_TYPE).includes(dataType) ? dataType : DATA_TYPE.HEART_RATE
    
    // load sensor data
    this.props.onLoad(sidebarTab, Promise.all([agent.Data.getAll(sidebarTab), agent.Data.getEncryptedData(sidebarTab), agent.Profile.get("lethanhtuan1028@gmail.com")]));
  }

  componentDidMount () {
   
  }
  
  componentWillUnmount () {
      // use intervalId from the state to clear the interval
      clearInterval(this.state.intervalId);
  }

    
  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    encryptDataInterVal(this.props)
    return (
      <div className="home-page">

        <div className="container page">
          <div className="row">
            <Sidebar />
            <MainView />

            
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
