// pages/addQuestion/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    level: '',
    name: '',
    emptyNum: '',
    ok: '',
    hx: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  commonSave(e) {
    const that = this
    switch (e.target.dataset.id) {
      case '1':
        that.setData({
          level: e.detail.value
        })
        setTimeout(()=>{
          const db = wx.cloud.database()
          db.collection('_chengyu').where({
            level: Number(that.data.level)
          }).get().then(res=>{
            if(res.data.length > 0){
              wx.showToast({
                title: '已经有存在的关卡了~',
                icon:'none'
              })
            }
          })
        },5000)
        break;
      case '2':
        that.setData({
          name: e.detail.value
        })
        break;
      case '3':
        that.setData({
          emptyNum: e.detail.value
        })
        break;
      case '4':
        that.setData({
          ok: e.detail.value
        })
        break;
      case '5':
        that.setData({
          hx: e.detail.value
        })
        break;
    }
  },
  shuffle(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      let rIndex = Math.floor(Math.random() * (i + 1));
      // 打印交换值
      let temp = arr[rIndex];
      arr[rIndex] = arr[i];
      arr[i] = temp;
    }
    return arr;
  },
  toSave() {
    const that = this
    const emptyNum = parseInt(that.data.emptyNum) < 5 ? parseInt(that.data.emptyNum) : 3
    const name = that.data.name;
    const question = name.split('').map((item, index) => {
      if (emptyNum == index + 1) {
        item = '？'
      }
      return item
    })
    const hx = that.data.hx
    const keyword = that.shuffle(hx.split('').concat([that.data.ok]))
    const data = {
      level: Number(that.data.level),
      question,
      keyword,
      ok: that.data.ok
    }
    const db = wx.cloud.database()
    db.collection('_chengyu').where({
      level: Number(that.data.level)
    }).get().then(res=>{
      if(res.data.length === 0){
        db.collection('_chengyu').add({
          data
        }).then(res=>{
          wx.showToast({
            title: '保存成功'
          })
          that.setData({
            level: '',
            name: '',
            emptyNum: '',
            ok: '',
            hx: '',
          })
        })
      }else{
        wx.showToast({
          title: '已经有存在的关卡了~',
          icon:'none'
        })
      }
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