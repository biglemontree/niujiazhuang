//index.js
//获取应用实例
var app = getApp()
const wechat = require('../../utils/wechat')
Page({
  data: {
    isShow: true,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular: true,
    current: 0
  },
  getList(){
    wechat.getLocation().then(res => {
        var lat = +res.latitude
        var lon = +res.longitude

        const user = wx.getStorageSync('user')
        let params = {lat, lon}
        if (user) {
          params.userId = user.id
          params.token = user.token
        }
        console.log(params);
        wechat.showBusy('加载中...')
        wechat.fetch(wechat.url, 'Company/companyList', params).then(data => {
          let list = data.data.info
          this.setData({
            list
          })
          wx.hideToast()
          wx.stopPullDownRefresh()
        }).catch(err => console.log('获取公司列表失败: ', err))
    })
  },
  onLoad: function () {
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
    this.getList()

  },
  goToSearch(){
    wx.navigateTo({
      url: './search/search'
    })
  },
  goToCompany(e){
    const cpid = (e.currentTarget.dataset.cpid)
    wx.navigateTo({
      url: `./company/company?companyId=${cpid}`
    })
  },
  joinBackup(e){
    let companyId = e.target.dataset.cpid
    console.log(companyId);
    app.addList(companyId)
  },
  onPullDownRefresh(){
    console.log('pull down');
    this.getList()
  },
  // share
  onShareAppMessage(){
    return {
      title: '牛家庄',
      desc: '自定义分享描述',
      path: '/page/user?id=123',
      success: function(res) {
        console.log('转发成功');
      },
      fail: function(res) {
        console.log('转发失败');
      }
    }
  }
})
