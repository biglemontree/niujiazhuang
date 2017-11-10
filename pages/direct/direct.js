// direct.js
const wechat = require('../../utils/wechat.js');
Page({

  data: {
    items: [

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
})
