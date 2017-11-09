function fetch(api, path, params) {
const Promise = require('./bluebird')
    return new Promise( (resolve, reject) => {
        wx.request({

            url: `${api}/${path}`,
            data: Object.assign({}, params),
            // method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {'Content-Type': 'json'}, // 设置请求的 header
            success: resolve,
            fail: reject,
        })
    })
}

function login(){
    return new Promise((resolve, reject)=>{
        wx.login({
            success: resolve,
            fail: reject,
        })
    })
}

function getUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            success: resolve,
            fail: reject,
        })
    })
}

function setStorage(key, value) {
    return new Promise((resolve, reject) => {
        wx.setStorage({
            key: key,
            data: value,
            success: resolve,
            fail: reject
        })
    })
}

function getStorage(key) {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key: key,
            success: resolve,
            fail: reject,
        })
    })
}

function getModal(title, content){
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content: JSON.stringify(content),
      // showCancel: false
      success: resolve,
      fail: reject
    })
  })
}
function getLocation(type) {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type, // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: resolve,
            fail: reject,
        })
    })
}

function showToast(title, icon){
  wx.hideToast()
    wx.showToast({
      title: title,
      icon: icon,
      duration: 1000,
      mask: true,
    })
}

function setData(e) {
    const key = e.target.dataset.set
    const obj = { key }
    obj[key] = e.detail.value
    this.setData(obj)
}

function showBusy(text) { // loading
    wx.showToast({
      title: text,
      icon: 'loading',
      duration: 10000
    });
}

function showModal(title, content){//显示失败
  return new Promise((resolve, reject) => {
    wx.hideToast();
    wx.showModal({
      title,
      content: JSON.stringify(content),
      showCancel: false,
      success: resolve,
      fail: reject
    });
  })
}

function checkPhone(phone){
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){
        showToast("手机号码有误，请重填", 'success')
        return false;
    }
    return true
}

const apiUrl = 'http://1u74g42002.imwork.net/niujiazhuang/api'
// const apiUrl = 'https://www.jakzx.com/niujiazhuang/api'
function uploadFile(tempFilePaths, formData) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${apiUrl}/UploadFile/UploadFile`,
      filePath: tempFilePaths,
      name: 'file',
      formData,
      header: {
        'Content-Type': 'multipart/form-data'
      },
      success: resolve,
      fail: reject
    })
  })
}

function gotoSignin(code, url) {
  if (code==422) {
    wx.navigateTo({
      url
    })
  }
}

function loadImg(e) {
  var $width=e.detail.width,    //获取图片真实宽度
        $height=e.detail.height,
        ratio=$width/$height;    //图片的真实宽高比例
    var viewWidth=718,           //设置图片显示宽度，左右留有16rpx边距
        viewHeight=718/ratio;    //计算的高度值
     var image=this.data.images;
     //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
     image[e.target.dataset.index]={
        width:viewWidth,
        height:viewHeight
     }
     this.setData({
          images:image
     })
}
function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: resolve,
      fail: reject
    })
  })
}
module.exports = {
  url: apiUrl,
  fetch,
  login,
  showModal,
  showBusy,
  showToast,
  getModal,
  getUserInfo,
  setStorage,
  getStorage,
  getLocation,
  uploadFile,
  checkPhone,
  getLocation,
  gotoSignin,
  loadImg,
  original: wx
}
