//app.js
const wechat = require('./utils/wechat');
App({
  onLaunch: function() {
    const self = this
    console.log('onLaunch');
    wechat.login().then( res => {
      let params = {type: '2'}
      // console.log(res.code);
      if (res.code) {
        params.jsCode = res.code
      }
      console.log(params);
      wechat.fetch(wechat.url, 'AccountAPI/getOpenId', params)
        .then((data) => {
          console.log('openId: ', data);
          wechat.setStorage('openId', data.data.openId)
        })
    })
  },
  addList(companyId){
    const user = wx.getStorageSync('user')
    if (!user) {
      wechat.showModal('登陆', '只有登录用户才能使用加入备选这个功能，请先登录').then(res => {
        wx.navigateTo({
          url: '/pages/index/signin/signin'
        })
        return
      })
    }
    const status = wx.getStorageSync('status')
    if (status  == 0) {
      wechat.showModal('提示', '只有完善资料才能使用加入备选这个功能，请先完善资料').then(res => {
        wx.navigateTo({
          url: '/pages/my/info/info'
        })
      })
      return
    }
    let params = {companyId, userId: user.id, token: user.token}
    wechat.showBusy('加入中...', 'loading')
    wechat.fetch(wechat.url, 'Company/addList', params).then(res => {
      let result = res.data;
      if (!result) {
        console.log('res.data 不存在');
        return
      }
      if (res.data.code === 1) {
        wx.hideToast()
        wechat.showToast('加入备选成功', 'success')
      }else if (res.data.code === 2) {
        wechat.showModal('提示!', '受邀已达上限')
      } else if (res.data.code === 0) {
        wechat.showToast('您已加入过备选','success')

      }
    }).catch(err => {
      console.log('加入备选失败! ', err);
      wechat.showModal('so sorry', '加入备选失败!')
    })
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          console.log(res.userInfo);
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  getLocationInfo(cb){
    const that = this
    if (this.globalData.locationInfo) {
      cb(this.globalData.locationInfo)
    } else {
      wx.getLocation({
        type: 'gcj02',
        success(res){
          that.globalData.locationInfo = res
          cb(that.globalData.locationInfo)
        },
        fail(){

        }
      })
    }
  },
  globalData: {
    userInfo: null,
    locationInfo: null,
    url: 'https://www.jakzx.com/niujiazhuang/api'
  }
})
