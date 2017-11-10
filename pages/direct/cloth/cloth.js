// cloth.js
const wechat = require('../../../utils/wechat.js');
const util = require('../../../utils/util.js');
const observer = require('../../../libs/observer.js').observer;

Page(observer({

  props: {
    directStore: require('../../../stores/direct').default
  },
  data: {
    indicatorDots: true,
    // autoplay: true,
    interval: 2000,
    duration: 1000,
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    imgheights: [],
    //图片宽度
    imgwidth: 750,
    current: 0
  },
  imageLoad: function (e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
    })
  },
  bindchange: function (e) {
    console.log(e.detail.current)
    this.setData({ current: e.detail.current})
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
    let moduleId = options.moduleId;
    let produceParams = {};
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });

    //获取模块商品列表
    wechat.fetch(wechat.url, 'Supply/commodityList', options)
          .then((value) => {
            let commodityList = value.data.commodityList;
            console.log(commodityList);
            produceParams.commodityId = commodityList[0].commodityId
            this.setData({
              commodityList,
              commodityId: commodityList[0].commodityId, //商品id
              title: commodityList[0].title, //
              moduleId: options.moduleId,
              deposit: commodityList[0].deposit //价格
            })
            // update state
            this.props.directStore.setter('moduleId', options.moduleId)
            this.props.directStore.setter('commodityId', commodityList[0].commodityId)
            this.props.directStore.setter('deposit', commodityList[0].deposit)
            this.props.directStore.setter('title', commodityList[0].title)
            console.log(this.props.directStore.title);
            wx.setNavigationBarTitle({
              title: this.props.directStore.title
            })
            // console.log(produceParams);
            //获取产品介绍
            wechat.fetch(wechat.url, 'Supply/commodityInfo', produceParams)
                  .then(value => {
                    this.setData({
                      photoInfo: value.data.photoInfo
                    })
                    // console.log(this.data.photoInfo);
                  })
            //获取评论列表
            console.log(produceParams);
            wechat.fetch(wechat.url, 'Supply/evaluateList', produceParams)
                  .then((value) => {
                    console.log(value);
                    let evaluateList = value.data.evaluateList
                    for (var i = 0; i < evaluateList.length; i++) {
                      let time = +evaluateList[i].evaluateTime
                      evaluateList[i].evaluateTime = util.formatTime(new Date(time))
                    }

                    this.setData({
                      evaluateList
                    })
                    console.log(evaluateList);
                  })
            return null
          })
          .catch(err => {
            console.log('获取模块商品列表: ', err)
          })

  },
  makeorder(){
    wechat.getStorage('user').then((user) => {
      if (user.data.id) {
        wx.navigateTo({
          url: `./make/make?commodityId=${this.data.commodityId}&moduleId=${this.data.moduleId}&title=${this.data.title}&deposit=${this.data.deposit}`
        })
      } else {
        console.log('no userId');

      }
    }).catch((err) => {
      console.log('no signin');
      wechat.getModal('登录', '只有登陆才能定制下单').then((value) => {
        wx.navigateTo({
          url: '../../index/signin/signin'
        })
      })
    })
  }
}))
