// pages/my/info/about/about.js
const wechat = require('./../../../../utils/wechat.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     const user = wx.getStorageSync('user')
     if (!user) {
       wx.navigateTo({
         url: './../../../index/signin/signin'
       })
       return ;
     }
     let params = {
       userId: user.id,
       token: user.token
     }
     wechat.showBusy('')
     wechat.fetch(wechat.url, 'User/userInfo', params).then(res => {
       this.setData({
         userinfo: res.data
       })
       wx.hideToast()
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
