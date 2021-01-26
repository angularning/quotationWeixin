//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    allData: {},
    rule: false,
  },

  onLoad: function() {
  },
  onShow(){
    const that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                hasUserInfo: true,
                userInfo: res.userInfo
              })
              wx.cloud.callFunction({
                name: 'login',
                data: res.userInfo,
                complete: res => {
                  that.setData({
                    allData: res.result
                  })
                  app.allData = res.result
                }
              });
            }
          })
        }
      }
    })
  },
  toGetGold(){
    wx.navigateTo({
      url: "/pages/article/index"
    });
  },
  toPrize(){
    wx.navigateTo({
      url: "/pages/prize/index"
    });
  },
  // 点击规则
  clickRule(){
    this.setData({
      rule: true
    })
  },
  // 关闭规则
  closeRule(){
    this.setData({
      rule: false
    })
  },
  // 开始游戏跳转
  starGame(){
    if(this.data.hasUserInfo){
      wx.navigateTo({
        url: "/pages/game/game"
      });
    }else{
      wx.showToast({
        title: '请先登录在玩吧！',
        icon: 'none'
      })
    }
  },
  getUserInfo: function (e) {
    const that = this;
    if (app.globalData.userInfo) {
      return
    }
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res)
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true,
                avatarUrl: res.userInfo.avatarUrl
              })
              // that.isLoginOrUpdate(res.userInfo)
              // 新用户获取授权之后更新user表
              wx.cloud.callFunction({
                name: 'login',
                data: res.userInfo,
                complete: res => {
                  that.setData({
                    allData: res.result
                  })
                  app.allData = res.result
                  wx.setStorageSync("allData",res.result)
                }
              });
            }
          })
        } else {
          console.log("拒绝")
        }
      }
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
