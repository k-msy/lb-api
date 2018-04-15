axios = require('axios')
constant = require('../../constant/pocket.js')

generate_err_obj = (e) => {
  const err = {
    status: e.response.status,
    statusText: e.response.statusText,
    'x-error': e.response.headers['x-error'],
    'x-error-code': e.response.headers['x-error-code']
  }
  return err
}

generate_access_token_options = (token) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    },
    data: {
      consumer_key: constant.CONSUMER_KEY,
      code: token
    },
    url: constant.ACCESS_TOKEN_URL
  }
  return options
}

module.exports = {
  request_token: async () => {
    const options = {
      consumer_key: constant.CONSUMER_KEY,
      redirect_uri: constant.REDIRECT_URI
    }
    try{
      let result = await axios.post(constant.REQUEST_TOKEN_URL, options)
      const data = {
        request_token: result.data.split('=')[1],
        redirect_uri: constant.REDIRECT_URI
      }
      return data
    }catch(e){
      const error = generate_err_obj(e)
      return error
    }
  },
  access_token: async (token) => {
    const options = generate_access_token_options(token)
    try{
      const result = await axios(options)
      return result.data
    }catch(e){
      const err = generate_err_obj(e)
      console.log(err)
      return err
    }
  }
}
