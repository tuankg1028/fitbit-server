const axios = require('axios')


const api = axios.create({
  baseURL: 'http://localhost:3333/api',
  timeout: 1000 * 30,
  headers: {}
});

const getRawData = async (type) => {
  const response = await api.get(`/sensors?type=${type}`, {}).catch(err => console.error(err))

  return response
}

const getProfile = async (email) => {
  const response = await api.get(`/users/profiles/${email}`, {}).catch(err => console.error(err))

  return response && response.data
}

const createEncryptedData = async (data) => {
  const response = await api.post(`/sensors/encrypted-data`, data).catch(err => console.error(err))

  return response
}

const getEncryptedData = async () => {
  const response = await api.get(`/sensors/encrypted-data`, {
    params: {
      pagination: 60 * 24 // 24h
    }
  }).catch(err => console.error(err))

  return response && response.data
}
module.exports = {
  getRawData,
  getProfile,
  createEncryptedData,
  getEncryptedData
}