// mOrder.js
const util = require('../../../utils/util.js');
const wechat = require('../../../utils/wechat.js');
Page({
  data: {
    items: [
      {
        image: '/images/my_order/btn_1.png',

      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wechat.showBusy('加载中...', 'loading')
    const user = wx.getStorageSync('user')
    if (!user) {
      console.log('no user');
      return ;
    }
      console.log(user);
      let params = {
        userId: user.id,
        token: user.token
      }
      console.log(params);
      wechat.fetch(wechat.url, 'Supply/UserOrderList', params).then(user => {
        console.log(user.data);
        const result = user.data

        if(result.code == 422){
          wx.navigateTo({
            url: '../../index/signin/signin'
          })
          return
        }
        if (+result.code == 0) {
          console.log('o');
          wechat.showToast('验证失败', 'success')
        }
        if(result.code !== 1){
          console.log('获取专属订单: code != 1');
          return
        }

        // let test = util.formatTime('1505532002000')
        // console.log(test);
        let orderList = user.data.orderList
        for (var i = 0; i < orderList.length; i++) {
          let iCreateTime = orderList[i].createTime
          orderList[i].createTime = util.formatTime(new Date(iCreateTime))
        }
        this.setData({
          UserOrderList: orderList
        })
        wx.hideToast()
      }).catch(err => console.log('获取专属订单失败: ', err))
  },
  serverCall(e){
    let phone = e.currentTarget.dataset.phone;
    util.makePhoneCall(phone)
  }
})
