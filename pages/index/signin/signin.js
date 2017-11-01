// signin.js
const wechat = require('../../../utils/wechat');
const observer = require('../../../libs/observer').observer
import store from '../../../stores/direct'
const app = getApp()
Page(observer({

  /**
   * 页面的初始数据
   */
  data: {
    VerifyCode: '获取验证码',
    disabled: ''
  },
  props: {
    // store: require('../../../../stores/direct').default
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  setPhone(e){
    let phone = e.detail.value;
    // wechat.checkPhone(phone)
    this.setData({
      phone
    })
  },
  count_down(totalSecond){
    if (totalSecond <= 0) {
      this.setData({
        VerifyCode: "重新发送",
        disabled: ''
      });
      // timeout则跳出递归
      return;
    }
    // 渲染倒计时时钟
    this.setData({
      VerifyCode: totalSecond + " 秒",
      disabled: 'disabled'
    });
    const that = this
    setTimeout(function () {
      // 放在最后--
      totalSecond -= 1;
      that.count_down(totalSecond);
    }, 1000)
  },
  // 获取验证码
  getCode(e){
    const url = app.globalData.url;
    const self = this

    let checkNum = wechat.checkPhone(this.data.phone)
    console.log(checkNum);
    if (!wechat.checkPhone(this.data.phone)) {
      wechat.showToast('号码有误')
      return
    }
    let params = {
      // phone: 15972038194,
      phone: this.data.phone
    }
    wechat.fetch(wechat.url, 'AccountAPI/getCode', params)
      .then((data) => {
        if (data.data.code == 1) {
          wechat.showToast('验证码发送成功~')
          this.count_down(60)
        }
        // wx.setStorage('token', )
        // wx.setStorageSync
      })
    return false
  },
  submit(e){
    let value = e.detail.value
    let phone = value.phone
    // wechat.checkPhone(phone)

    let code = value.code
    let params = {
      phone,
      code // 181: 345302
    }
    console.log(params);
    wx.clearStorage('user')
    wx.clearStorage('status')
    wechat.fetch(wechat.url, 'AccountAPI/userLogin', params)
    .then((data) => {
      console.log(data);
      if (data.data.code == 0 || data.data.statusCode == 500) {
        wx.showToast({title: '验证登录失败', icon: 'loading'})
        return
      }

      wechat.setStorage('user', data.data.user)
      wechat.setStorage('status', data.data.status)


      wx.reLaunch({url: './../index'})
    }).catch(err => console.log('登录失败: ', err))

  },
}))
