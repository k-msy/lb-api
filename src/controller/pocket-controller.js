model = require('../model/Pocket.js')

module.exports = {
  // request_tokenとredirect_urlを取得して返す
  request_token: async (req, res) => {
    const result = await model.request_token()
    res.json(result)
  },
  access_token: async (req, res) => {
    const result = await model.access_token(req.query.request_token)
    res.send(result)
  },
  retrieve: async (req, res) => {
    const result = await model.retrieve(req.query.access_token)
    res.send(result)
  }
}
