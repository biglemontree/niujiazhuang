// info.js
const wechat = require('../../../utils/wechat');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: ''
  },
  choosePos(){
    const  _this = this
    let key = this.data.userinfo.address
    wx.chooseLocation({
      success(data){
        console.log(data);
        _this.setData({
          address: data.address,
          ['userinfo.address']: data.address
        })
      }
    })
  },
  onLoad(){
    const user = wx.getStorageSync('user')
    if (!user) {
      wx.navigateTo({
        url: './../../../index/signin/signin.js'
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
  submit(e){
    wechat.showBusy('资料更改中...')
    const userinfo = e.detail.value //{house: ''}
    userinfo.budget = + userinfo.budget
    const user = wechat.getStorage('user').then((value) => {
      let user = value.data
      let params = {
        ...userinfo,
        id: user.id,
        phone: +user.phone,
        token: user.token
      }
      let isNull = userinfo.userName && userinfo.house && userinfo.budget && userinfo.address && userinfo.neighbourhood && userinfo.houseStyle && userinfo.style && userinfo.budget && userinfo.planTime
      if(!isNull){

        wechat.showToast('资料填写不完整')
        return
      }
      console.log(params);
      wechat.fetch(wechat.url, 'AccountAPI/completeData', params)
            .then((value) => {
              console.log(value);
              if(value.data.code===1){
                console.log(value);
                wechat.setStorage('status', 1)
                wx.hideToast()
                wx.navigateTo({
                  // url: "../../index/index",
                  url: "./about/about"
                })
              };
              if(value.data.code == 422){

                wx.navigateTo({
                  url: '../../index/signin/signin'
                })
                return
              }
            })
            .catch((err) => {
              console.log(err);
            })
    })
    .catch((err) => {
      console.log('个人信息获取失败');
    })
  },

})
