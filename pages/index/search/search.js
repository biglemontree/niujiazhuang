// pages/index/search/search.js
const wechat = require('./../../../utils/wechat.js');
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
