// pages/duihuan/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsRecord: [],
  },
  filterTime(input) {
    console.log(input)
    if (!input) {
      return
    }
    const t = input.split('T')
    return t[0] + ' ' + t[1].split('.')[0]
  },
  getRecordList() {
    const that = this;
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getUser',
      },
      complete: res => {
        const data = res.result.data[0]
        that.setData({
          goodsRecord: Object.assign(data.goodsRecord.map(item=>{item.time=that.filterTime(item.time) 
            return item}),{}),
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecordList();
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