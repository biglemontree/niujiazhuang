// make.js
const wechat = require('../../../../utils/wechat.js')
const observer = require('../../../../libs/observer.js').observer;
Page(observer({
  props: {
    directStore: require('../../../../stores/direct').default
  },
  data: {
    date: '2016-09-01',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)

  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  submit(e){
    const formValue = e.detail.value
    if(formValue.checkbox.length<1){
      wechat.showModal('提示', '请确认同意条款')
    }
    const openId = wx.getStorageSync('openId')
    const user = wx.getStorageSync('user')
    const isNull = formValue.name && formValue.phone && formValue.address && formValue.meetTime
    if (!isNull) {
      wechat.showToast('缺少必填信息')
      return
    }
      let userData = {
        moduleId: this.data.moduleId,
        commodityId: this.data.commodityId,
        name: formValue.name,
        phone:  formValue.phone,
        address: formValue.address,
        openId,
        meetTime: formValue.meetTime,
        id: user.id,
        type: '2',
        content: 'yydz',
        token: user.token
      }
      console.log(userData);

      wechat.fetch(wechat.url, 'Supply/newOrder', userData)
      .then((value) => {
        console.log(value)
        if (!value.data.orderId) {
          console.log('orderId ', 失败)
          return
        }
        let payParams = {
          openId,
          id: user.id,
          type: '2',
          payType: 'YYDZ',
          orderId: value.data.orderId,
          token: user.token
        }
        console.log(payParams);
        wechat.fetch(wechat.url, 'Company/pay', payParams)
        .then((value) => {
         const result = value.data.result
         console.log(result)
         if (result) {
           wx.requestPayment({
             signType: 'MD5',
             ...result,
             success(data){
               console.log(data)
             },
             fail(res){
               console.log(res)
             },
             complete(res){
               console.log(res)
             }
           })
         }
        }).catch(err => console.log('获取支付参数失败: ', err))
        return null
      })
      .catch(err => {
        console.log('获取orderId失败: ', err)
      })







  }
}))
