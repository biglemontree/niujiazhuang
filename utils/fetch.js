const Promise = require('./bluebird')

module.exports = function (api, path, params) {
    return new Promise( (resolve, reject) => {
        wx.request({
            url: `${api}/${path}`,
            data: Object.assign({}, params),
            // method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {'Content-Type': 'json'}, // 设置请求的 header
            success: resolve,
            fail: reject,
        })
    })
}

// module.exports
