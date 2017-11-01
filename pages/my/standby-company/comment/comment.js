// comment.js
const wechat = require('../../../../utils/wechat');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [
      {
        code: 100,
        version: '满意',
        isChoosed: true
      },
      {
        code: 95,
        version: '一般',
        isChoosed: false
      },
      {
        code: 90,
        version: '差评',
        isChoosed: false
      },
    ],
    items: [
      {name: '满意', value: '100'},
      {name: '一般', value: '95', checked: 'true'},
      {name: '差评', value: '90'},
    ]
  },
  onLoad(options){
    console.log(options);
    this.setData(options)
    const user = wx.getStorageSync('user')
    if (!user) {
      console.log('no user');
      return
    }
    console.log(user);

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  formSubmit(e){
    let value = e.detail.value
    let comment = value['radio-group']
    let item = this.data.items.filter(item => item.name === comment)
    let number = item[0].value
    const user = wx.getStorageSync('user')
    let params = {
      companyId: this.options.companyId,
      userId: user.id,
      code: +number,
      token: user.token,
      evaluate: value.evaluate
    }
    console.log(params);

    // wechat.showToast('提交...', 'success')
    wechat.fetch(wechat.url, 'Company/companyEvaluate', params).then(res => {
      console.log(res)
      if(res.data.code !== 1){
        return
      }
      // wechat.gotoSignin(res.data.code === 422, '/pages/index/signin/signin')
      wechat.showToast('评论成功~', 'success')
        wx.navigateTo({
          url: '../standby-company'
        })


    })
  }
})
