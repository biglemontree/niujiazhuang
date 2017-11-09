//index.js
//获取应用实例
var app = getApp()
const wechat = require('../../utils/wechat')
Page({
  data: {
    isShow: true,

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
          params.userId = user.id,
          params.token = user.token
        }
        console.log(params);
        wechat.showBusy('加载中...')
        wechat.fetch(wechat.url, 'Company/companyList', params).then(data => {
          let list = data.data.info
          console.log(data);
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
  // 失去焦点
  hideCompany(e){

    this.setData({
      'isShow': !this.data.isShow
    })
  },
  // 按下搜索键
  searchCompany(e){
    let value = e.detail.value;
    wechat.showBusy('搜索中...')
    wechat.getLocation().then(res => {
      let params = {companyName: value, lat: +res.latitude, lon: +res.longitude}
      wechat.fetch(wechat.url, 'Company/search', params).then(data => {
        if (data.data.code == 1) {

          let list = data.data.companyList;
          this.setData({
            search: list
          })
          wx.hideToast()
          //this.hideCompany() //显示公司
        }
      })
    })
  },
  goToSearch(){
    wx.navigateTo({
      url: './search/search'
    })
  },
  goToCompany(e){
    // wx.na
    let index = e.currentTarget.dataset.index;
    this.setData({
      current: index
    })
    this.hideCompany() //显示公司
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
