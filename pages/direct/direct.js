// direct.js
const wechat = require('../../utils/wechat.js');
Page({

  data: {
    items: [
      // {
      //   icon: '/images/own/btn_chugui.png',
      //   name: '橱柜定制',
      //   url: './cabinet/cabinet'
      // },
      // {
      //   icon: '/images/own/btn_yigui.png',
      //   name: '衣柜定制',
      //   url: '/pages/direct/cloth/cloth'
      // },
      // {
      //   icon: '/images/own/btn_men.png',
      //   name: '室内房门',
      //   url: './door/door'
      // },
      // // {
      // //   icon: '/images/own/btn_chuanghu.png',
      // //   name: '防护封窗',
      // //   url: './protect/protect'
      // // },
      // {
      //   icon: '/images/own/btn_chuanglian.png',
      //   name: '窗帘布艺术',
      //   url: './window/window'
      // },
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
    }
    wechat.fetch(wechat.url, 'Module/onloadModule')
          .then((value) => {
            if(value.data.code === 1){
              let module = value.data.module
              let result = []
              console.log(module);
              for (var i = 0; i < module.length; i++) {
                module[i].url = `/pages/direct/cloth/cloth?moduleId=${module[i].moduleId}`
                module[i].icon = `/images/own/btn_${i}.png`
              }

              this.setData({
                'items': module
              })
            }else {
              console.log('获取模块失败');
            }
            return null
          }).catch(err => {console.log('获取模块失败');})
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
