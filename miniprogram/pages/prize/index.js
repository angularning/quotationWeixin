// pages/prize/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOneButtonDialog: false,
    showGoldDialog: false,
    allData: {},
    goodsRecord: [],
    buttons: [{
      text: '确定'
    }],
    goodsList: [],
    detail: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsList();
    this.getUser();
  },
  getUser(){
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
          userAddress: data.userAddress,
          goodsRecord: data.goodsRecord
        })
      }
    });
  },
  duihuan(detail) {
    console.log(detail)
    const that = this;
    wx.showModal({
      content: `确定要兑换${detail.currentTarget.dataset.data.name}吗？`,
      success(res) {
        if (res.confirm) {
          if(Number(that.data.allData.money)<Number(detail.currentTarget.dataset.data.price)){
              wx.showToast({
                title: '金钱不够，去答题多赚点吧！',
                icon: 'none'
              })
              return
          }
          if(!app.isEmpty(that.data.userAddress)){
            // 更新金币数量，兑换商品 // 更新兑换记录列表
            const goodsRecord = that.data.goodsRecord
            const temp = []
            const obj = Object.assign(detail.currentTarget.dataset.data,{time: new Date()})
            temp.push(obj)
            wx.cloud.callFunction({
              name: 'openapi',
              data: {
                action: 'updateuser',
                money: (Number(that.data.allData.money) - Number(detail.currentTarget.dataset.data.price)).toFixed(2),
                goodsRecord: goodsRecord&&goodsRecord.length>0?goodsRecord.concat(temp):temp
              },
              complete: res => {
                console.log(res)
                that.setData({
                  allData: res.result.data,
                  goodsBox: false,
                })
                app.allData = res.result
                wx.showToast({
                  title: '兑换成功',
                  icon: 'success'
                })
                // 更新商品数量
              }
            });
          }else{
            wx.navigateTo({
              url: "/pages/address/index"
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getGoodsDetail(res){
    const temp = this.data.goodsList.filter(item=>{
      return item._id===res.currentTarget.dataset.id
    })
    if(!temp){
      return
    }
    this.setData({
      goodsBox: true,
      detail: temp[0].detail
    })
  },
  getGoodsList() {
    const that = this;
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getGoodsList',
      },
      complete: res => {
        that.setData({
          goodsList: res.result.data
        })
      }
    });
  },
  toAddress() {
    wx.navigateTo({
      url: "/pages/address/index"
    })
  },
  toRecord(){
    wx.navigateTo({
      url: "/pages/duihuan/index"
    })
  },
  toShowGold() {
    this.setData({
      showGoldDialog: true
    })
  },
  closeBox(){
    this.setData({
      goodsBox: false
    })
  },
  toMine() {
    this.setData({
      showOneButtonDialog: true
    })
    // wx.navigateTo({
    //   url: "/pages/mine/index"
    // })
  },
  tapDialogButton(e) {
    this.setData({
      showOneButtonDialog: false
    })
  },
  okGold(e) {
    this.setData({
      showGoldDialog: false
    })
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