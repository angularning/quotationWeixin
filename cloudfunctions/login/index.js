// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'a20200426-ogh1a',
})
const db = cloud.database()
const _ = db.command
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log(context)
  const wxContext = cloud.getWXContext()
  const data ={
    _openid: wxContext.OPENID,
    userInfo: event,
    goldCoin: 500,
    money: 0,
    level: 1,
  }
  // 可执行其他自定义逻辑
  return db.collection('user').where({
    _openid: wxContext.OPENID
  }).get().then(async res=>{
    if(!res.data.length>0){
      await db.collection('user').add({
        data
      })
      return {
        event,
        data: data,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
      }
    } else {
      return {
        event,
        data: res.data[0],
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
      }
    }
  })
}

