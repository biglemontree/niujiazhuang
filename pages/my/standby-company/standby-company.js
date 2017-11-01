// standby-company.js
const wechat = require('../../../utils/wechat.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let params = {}

    wechat.getStorage('user').then((value) => {
      const params = {
        userId: value.data.id,
        token: value.data.token
      }
      console.log(params);
      wechat.showBusy('加载中...', 'loading')
      wechat.fetch(wechat.url, 'Company/addCompanyList', params)
            .then((value) => {
              console.log(value);
              if (value.data.code== 422) {
                wx.navigateTo({
                  url: '../../index/signin/signin'
                })
              }
              this.setData({
                'companyList': value.data.companyList
              })
              wx.hideToast()
            })
            .catch((err) => {
              console.log('备选公司list: ', err);
            })
      return null
    }).catch(err => {
      console.log(err);
    })
  },

  makeCall(e){
    console.log(e.currentTarget.dataset.phone);
    let phone = e.currentTarget.dataset.phone
    if (!phone) {
      return
    }
    util.makePhoneCall(phone)
  },
  goToComment(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url
    })
  }
})
