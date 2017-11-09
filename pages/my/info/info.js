// info.js
const wechat = require('../../../utils/wechat');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    houseStyle: '',
    checkgroups: [
      {name: '5天内', value: '5天内'},
      {name: '10天内', value: '10天内'},
      {name: '15天内', value: '15天内', checked: 'true'},
    ],
    multiArray: [['1房', '2房', '3房', '4房', '5房'], ['0厅', '1厅', '2厅', '3厅', '4厅'], ['0卫', '1卫', '2卫', '3卫', '4卫']],
    multiIndex: [0, 1, 1],
    array: ['中式', '欧式', '现代', '简装', '其他'],
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

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const multiIndex = e.detail.value
    const pickMulti = this.data.multiArray
    this.setData({
      multiIndex: e.detail.value,
      ['userinfo.houseStyle']: `${pickMulti[0][multiIndex[0]]}${pickMulti[1][multiIndex[1]]}${pickMulti[2][multiIndex[2]]}`
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const pickIndex = e.detail.value
    const pickStyle = this.data.array
    this.setData({
      ['userinfo.style']: `${pickStyle[pickIndex]}`
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
        userinfo: res.data,
      })
      wx.hideToast()
    })
  },
  submit(e){
    wechat.showBusy('资料更改中...')
    const userinfo = e.detail.value //{house: ''}
    userinfo.budget = + userinfo.budget
    userinfo.houseStyle =  this.data.userinfo.houseStyle
    userinfo.style =  this.data.userinfo.style
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
