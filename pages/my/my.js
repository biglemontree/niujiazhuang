// pages/my/my.js
var util = require('../../utils/util.js');

Page({

  data: {
    items: [{
        icon: '/images/me/btn_order.png',
        name: '专属订单',
        url: './mOrder/mOrder'
      },
      {
        icon: '/images/me/btn_rent.png',
        name: '出租出售',
        url: './rent-sale/rent-sale'
      },
      {
        icon: '/images/me/btn_backup.png',
        name: '备选公司',
        url: './standby-company/standby-company'
      },
      {
        icon: '/images/me/btn_call.png',
        name: '在线投诉',
      },
      {
        icon: '/images/me/btn_info.png',
        name: '个人资料',
        url: './info/about/about'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = wx.getStorageSync('user')
    if(!user){
      wx.navigateTo({
        url: '../index/signin/signin'
      })
      return
    }
    this.setData({
      user
    })
  },


  changeUser: function () {
    wx.navigateTo({
      url: '../index/signin/signin'
    })
  },
  calling(e){
    console.log(e);
    let phone = '4006159008';
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
      fail(msg){
        console.log(msg);
      }
    })
  },
  onlineComplaint(e){
    util.makePhoneCall('4006159008')

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
