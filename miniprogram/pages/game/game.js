const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      allData: {},
      sharetype: "guess",
      queList:{},
      hasHongbao: false,
      hbData: ''
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      allData: app.allData
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
    const that = this
    that.wentilist();
  },
  close(e){
    this.setData({
      hasHongbao: false
    })
  },
  // 领取之后关闭
  lingqu(e){
    if(e.detail){
      this.updateUser(e.detail)
      // setTimeout(()=>{
      //   this.close();
      // },3000)
    }
    // 进行领取红包的操作更新用户的红包钱
    
  },
  // 更新用户信息
  updateUser(param){
    const that = this
    console.log(param)
    console.log(that.data.allData.data)
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'updateUserMoney',
        money: Number(param)+Number(that.data.allData.data.money)
      },
      complete: res => {
        console.log(res)
        // that.setData({
        //   allData: res.result
        // })
        // wx.setStorageSync("allData",res.result)
      }
    });
  },
  // 获取当前问题
  wentilist(level) {
    const that = this;
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'wenti',
        level: level?level:that.data.allData.data.level
      },
      complete: res => {
        console.log(res)
        const data = res.result.data[0]
        if(res.errMsg==='cloud.callFunction:ok'){
          that.setData({
            queList: data
          })
        }
      }
    });
  },
  // 点击选项
  check(options){
    const that = this;
    const dataset = options.currentTarget.dataset;
    if(Number(that.data.allData.data.goldCoin)>99){
      if(that.data.queList.ok === dataset.name){
        // 更新用户信息，关卡加1，金币-100
        if(that.data.queList.hongbao){
          that.setData({
            hasHongbao: true,
            hbData: that.data.queList.hongbao
          })
        }
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'updateuser',
            level: that.data.allData.data.level+1,
            goldCoin: parseInt(that.data.allData.data.goldCoin) - 100,
          },
          complete: res => {
            that.setData({
              allData: res.result
            })
            app.allData = res.result
            that.wentilist(res.result.data.level)
            wx.setStorageSync("allData",res.result)
          }
        });
        app.happy('回答正确')
      }else{
        // 答错
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'updateuser',
            level: that.data.allData.data.level,
            goldCoin: parseInt(that.data.allData.data.goldCoin) - 100,
          },
          complete: res => {
            that.setData({
              allData: res.result
            })
            app.allData = res.result
            wx.setStorageSync("allData",res.result)
          }
        });
        app.sad('回答错误')
      }
    }else{
      wx.showModal({
        title: "温馨提示",
        content: "您的金币已经不足，请返回小程序首页，获取更多金币",
        confirmText: "我知道了",
        confirmColor: "#fd5757",
        success: function (t) {
          t.confirm && wx.navigateBack({
            url: "/pages/index/index"
          });
        }
      })
    }
  },
  addQuestion(){
    wx.navigateTo({
      url: "/pages/addQuestion/index"
    })
    // const data ={
    //   level: 2,
    //   question: ['众','志','成','？'],
    //   keyword: ['城','新','乐','云',],
    //   ok: '城'
    // }
    // const db = wx.cloud.database()
    // db.collection('_chengyu').add({
    //   data
    // })
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
  onShareTimeline: function () {
    var a = t.chuigeshare(this.data.sharetype), i = this.data.userInfo, n = "?from=" + this.data.sharetype;
    return "1" == i.status && (n += "&uuid=" + i._id), {
      title: a.title,
      path: '/pages/index/index' + n,
      imageUrl: a.imageUrl,
      success: function (t) { },
      fail: function (t) { },
      complete: function () { }
  }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var a = t.chuigeshare(this.data.sharetype), i = this.data.userInfo, n = "?from=" + this.data.sharetype;
    return "1" == i.status && (n += "&uuid=" + i._id), {
      title: a.title,
      path: '/pages/index/index' + n,
      imageUrl: a.imageUrl,
      success: function (t) { },
      fail: function (t) { },
      complete: function () { }
  }
  }
})