const app = getApp()
const labelMap = {
  '家': 0,
  '公司': 1,
  '学校': 2,
}
Page({
  /**
   * 控件当前显示的数据
   * provinces:所有省份
   * citys 选择省对应的所有市,
   * areas 选择市对应的所有区
   * consigneeRegion：点击确定时选择的省市县结果
   * animationAddressMenu：动画
   * addressMenuIsShow：是否可见
   */
  /**
   * 页面的初始数据
   */
  data: {
    allData: {},
    provinceName: '',
      cityName: '',
      countyName: '',
      detailInfo: '',
      countyName: '',
      userName: '',
      telNumber: '',
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    phone: "",
    provinceCity: "",
    detailAddress: "",
    labelList: ["家", "公司", "学校"], //标签
    labelDefault: 0, // 标签默认,
    tagName: '家'


  },
  consigneeNameInput: function (e) {
    this.setData({
      userName: e.detail.value,
    })
  },
  phoneInput: function (e) {
    this.setData({
      telNumber: e.detail.value
    })
  },
  provinceCityInput: function (e) {
    this.setData({
      provinceCity: e.detail.value
    })
  },
  detailAddressInput: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  submit: function () {
    const that = this;
    const data = that.data
    const userName = data.userName;
    const telNumber = data.telNumber;
    const provinceCity = data.provinceCity
    const detailAddress = data.detailAddress
    const tagName = data.tagName
    if (app.isEmpty(userName)) {
      wx: wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false
    }
    else if (app.isEmpty(telNumber)) {
      wx: wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return false
    }
    else if (app.isEmpty(detailAddress)&&app.isEmpty(provinceCity)) {
      wx: wx.showToast({
        title: '请输入收货地址',
        icon: 'none'
      })
      return false
    }
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'updateuser',
        userName,
        telNumber,
        provinceCity,
        detailAddress,
        tagName
      },
      complete: res => {
        that.setData({
          allData: res.result,
        })
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
      }
    });
  },
  chooseDefault() {
    const that = this
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          userName: res.userName,
          telNumber: res.telNumber,
          provinceCity: res.provinceName + res.cityName + res.countyName,
          detailAddress: res.detailInfo,
        })
      }
    })
  },
  getUserAddress(){
    const that = this;
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getUser',
      },
      complete: res => {
        const data = res.result.data[0]
        that.setData({
          allData: data,
          userName: data.userAddress.userName,
          telNumber: data.userAddress.telNumber,
          provinceCity: data.userAddress.provinceCity,
          detailAddress: data.userAddress.detailAddress,
          tagName: data.tagName,
          labelDefault: labelMap[data.tagName]
        })
      }
    });
  },
  chooseLabelSelect(e){
    this.setData({
      labelDefault: e.currentTarget.dataset.index,
      tagName: e.currentTarget.dataset.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserAddress();
    //     const that = this
    //     wx.chooseAddress({
    //       success:function(res){
    //       console.log(res)
    //       that.setData({
    //         userMessage: res,
    //         consigneeRegion: res.provinceName+ res.cityName + res.countyName
    //       })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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