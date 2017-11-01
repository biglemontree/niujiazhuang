// rent-sale.js
const util = require('../../../utils/util.js');
const wechat = require('../../../utils/wechat.js');
const app = getApp()
let photoId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkgroups: [
      {name: 'sease', value: '出租'},
      {name: 'sell', value: '出售', checked: 'true'},
    ]
  },
  onLoad(){
    const that = this
    app.getLocationInfo((locationInfo) => {
      that.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
        markers: [{
          id: 0,
          iconPath: '../../../images/me/btn_map.png',
          longitude: locationInfo.longitude,
          latitude: locationInfo.latitude,
        }],
        circles: {
          latitude: -30,
          longitude: 30,
          radius: 20,
          strokeWidth: 2
        }
      })
    })
  },
  //获取中间点的经纬度，并mark出来
  getLngLat(){
    const that = this
    this.mapCtx = wx.createMapContext("map4select")
    this.mapCtx.getCenterLocation({
      success(res){
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers: [
            {id: 0,
            iconPath:'../../../images/me/btn_map.png',
            longitude: res.longitude,
            latitude: res.latitude,}
          ]
        })
      }
    })
  },
  regionchange(e){
    if (e.type == 'end') {
      this.getLngLat()
    }
  },
  markertap(e){
    console.log(e);

  },
  onReady(e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  makeChoice(array, key, type) {
    console.log(array);
    for (var i = 0; i < array.length; i++) {
      if (type) {
        let obj = {}
        obj[array[i][key]] = !array[i][key]
        this.setData(obj)
      } else {
      }
    }
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e)
  },
  chooseImg(){
    var _this = this;
    const uploadTask = wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        _this.setData({
          tempPath: tempFilePaths
        })
        let params = {
          fileTitle: 'other',
          type: '3'
        }
        for (var i = 0; i < tempFilePaths.length; i++) {

          wechat.uploadFile(tempFilePaths[i], params).then( res => {
            let data = JSON.parse(res.data);
            console.log(data);
            // i+1< tempFilePaths.length? (data.photoId[0]+',') : data.photoId[0]
            photoId += (data.photoId[0]+',')
          })
        }
      }
    })

    // uploadTask.abort() // 取消上传任务
  },
  submit(e){
    console.log(photoId);
    const value = e.detail.value
    wechat.getStorage('user').then((user) => {

      const hasSease = value.checkbox.find(content => {
        return content === 'sease'
      })
      const hasSell = value.checkbox.find(content => {
        return content === 'sell'
      })
      console.log(hasSease);
      let result = wechat.checkPhone(value.phone)
      if (!result) {
        return
      }
      let isNull = value.neighbourhood && value.houseStyle && value.floor
      if(!isNull){
        wechat.showToast('信息不完善')
        return
      }
      let params = {
        userId: user.data.id,
        token: user.data.token,
        sease: hasSease? 1 : 0,
        sell: hasSell? 1 : 0,
        // ...value,
        neighbourhood: value.neighbourhood,
        houseStyle: value.houseStyle,
        floor: value.floor,
        content: value.content,
        userName: value.userName,
        phone: value.phone,
        rent: value.rent,
        deposit: value.deposit,
        photoId: photoId,
      }
      console.log(params);
      wechat.showBusy('提交中...')
      wechat.fetch(wechat.url, 'Sell/add', params).then((value) => {
              console.log(value);
              if(value.data.code == 1) {
                wechat.showToast('提交成功', 'success')
                wx.navigateBack({})

              }
            }).catch(err => console.log('出租出售添加失败: ', err))
      console.log(params);
    })
  }
})
