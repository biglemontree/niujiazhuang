function formatTime(date) {
  // date 为日期 new Date(timestamp)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function makePhoneCall(phoneNumber) {
  wx.makePhoneCall({
    phoneNumber: phoneNumber
  })
}

function makeChoice(array, key, type) {
  console.log(array);
  for (var i = 0; i < array.length; i++) {
    if (type) {
      let obj = {}
      obj[array[i][key]] = !array[i][key]
      this.setData(obj)
    } else {
    }
  }
}

module.exports = {
  formatTime,
  makePhoneCall,
  makeChoice,

}
