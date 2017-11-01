const extendObservable = require('../libs/mobx.js').extendObservable;
const directStore = function(){
  extendObservable(this, {
    openId: '',
    moduleId: '',
    commodityId: '',
    title: '',
    deposit: ''
  });

  this.setOpenId = id => {
    this.openId = id
  }
  this.setModuleId = id => {
    this.moduleId = id
  }
  this.setter = (key, value) => {
    this[key] = value
  }
  this.setCommodityId = id => {
    this.commodityId = id
  }

  this.getTitle = () => this.title
}

module.exports = {
    default: new directStore,
}
