constant = require('../constant/pocket.js')
auth = require('./auth/Pocket.js')

sortDescTimeAdded = vals => {
  vals.sort((a, b) => {
    if (a.time_added > b.time_added) return -1
    if (a.time_added < b.time_added) return 1
    return 0
  })
  return vals
}

unixTime2Ymd = unixtime => {
  const d = new Date(unixtime * 1000)
  const year = d.getFullYear()
  const month = (`0${d.getMonth() + 1}`).slice(-2)
  const day = (`0${d.getDate()}`).slice(-2)
  const hour = (`0${d.getHours()}`).slice(-2)
  const min = (`0${d.getMinutes()}`).slice(-2)
  const sec = (`0${d.getSeconds()}`).slice(-2)
  return (`${year}-${month}-${day} ${hour}:${min}:${sec}`)
}

reshapeData = lists =>{
  // console.log(Object.keys(lists))
  const keys = Object.keys(lists)
  let values = []
  for(let key of keys){
    values.push(lists[key])
  }
  // Pocketに追加した日付の降順にソート
  values = sortDescTimeAdded(values)
  let reshapedArray = []
  for(let val of values){
    let reshaped = {}
    reshaped['resolved_title'] = val.resolved_title
    reshaped['resolved_url'] = val.resolved_url
    reshaped['time_added'] = unixTime2Ymd(val.time_added)
    reshapedArray.push(reshaped)
  }
  return reshapedArray
}


module.exports = {
  request_token: async () => {
    const result = await auth.request_token()
    return result
  },
  access_token: async (token) => {
    const result = await auth.access_token(token)
    return result
  },
  retrieve: async (access_token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Accept': 'application/json'
      },
      data: {
        consumer_key: constant.CONSUMER_KEY,
        access_token: access_token,
        sort: 'newest',
        count: 10
      },
      url: constant.RETRIEVE_URL
    }
    let data = await axios(options)
    const result = reshapeData(data.data.list)
    return result
  }
}
