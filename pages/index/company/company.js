// company.js
const wechat = require('../../../utils/wechat')
const util = require('../../../utils/util')
const app = getApp()
let companyId= ''
var px2rpx = 2, windowWidth=375;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    loading: false,
    imageSize: {}
  },
  tabFun: function(e){
    //获取触发事件组件的dataset属性
    var _datasetId=e.target.dataset.id;
    console.log("----"+_datasetId+"----");
    var _obj={};
    _obj.curHdIndex=_datasetId;
    _obj.curBdIndex=_datasetId;
    this.setData({
      tabArr: _obj
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     companyId = options.companyId
     console.log(typeof companyId);
     const user = wx.getStorageSync('user')
     let companyInfo = {companyId}
     let gdExampleInfo = {companyId}
     if (user) {
       companyInfo.userId = user.id
       gdExampleInfo.userId = user.id
     }
     wechat.showBusy('加载中...')
    //  公司档案
    wechat.fetch(wechat.url, 'Company/companyInfo', companyInfo).then(res => {
      let companyInfo = res.data
      this.setData({companyInfo})
    })
    //  公司案例
    wechat.fetch(wechat.url, 'GdExample/gdExampleInfo', gdExampleInfo).then(res => {
      let GdExampleInfo = res.data.GdExampleInfo
      this.setData({GdExampleInfo, isBackup: res.data.status});
      wx.hideToast()
    })
    // 业主口碑
    wechat.fetch(wechat.url, 'Company/companyEvaluateList', {companyId}).then(res => {
      let evaluateList = res.data.evaluateList

      const newEvaluateList = evaluateList.map(item => {
        let evaluateTime = item.createTime

        item.createTime = util.formatTime(new Date(+evaluateTime))
        return item
      })

      console.log(newEvaluateList);
      this.setData({evaluateList: newEvaluateList})
    })
  },
  // 添加案例
  addList(){
    console.log(companyId);
    app.addList(companyId, this)
  },

  imageLoad:function(e){
        //单位rpx
        var originWidth = e.detail.width*px2rpx,
        originHeight = e.detail.height*px2rpx,
        ratio = originWidth/originHeight;
        var viewWidth = 710,viewHeight//设定一个初始宽度
        //当它的宽度大于初始宽度时，实际效果跟mode=widthFix一致
        if(originWidth>= viewWidth){
            //宽度等于viewWidth,只需要求出高度就能实现自适应
            viewHeight = viewWidth/ratio;
        }else{
            //如果宽度小于初始值，这时就不要缩放了
            viewWidth = originWidth;
            viewHeight = originHeight;
        }
        var imageSize = this.data.imageSize;
        imageSize[e.target.dataset.index] = {
            width:viewWidth,
            height:viewHeight
        }
        this.setData({
            imageSize:imageSize
        })
    },
   notLike(){
     wx.showToast({
       title: '您未加入备选',
       icon: 'loading',
       during: '500'
     })
   },
  giveGoods(e){
    let dataset = e.currentTarget.dataset
    let gdId = dataset.gdid
    let index = dataset.index
    let userId = wx.getStorageSync('user').id
    if (!userId) {
      wx.navigateTo({
           url: './../signin/signin'
         })
      // wechat.showToast('userid不存在')
      return
    }
    wechat.fetch(wechat.url, 'GdExample/clickLike', {gdId, userId}).then(res => {
      let count = res.data.count
      console.log(count);
      this.setData({
        ['GdExampleInfo['+index+'].likesCount']: count,
        ['GdExampleInfo['+index+'].likesStatus']: res.data.status
      })
    })
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
