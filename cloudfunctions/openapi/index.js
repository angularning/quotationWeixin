// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'a20200426-ogh1a',
})
const db = cloud.database()
const _ = db.command
const wxContext = cloud.getWXContext()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getUser': {
      return getUser(event)
    }
    case 'wenti': {
      return wenti(event, context)
    }
    case 'updateuser': {
      return updateUser(event)
    }
    case 'updateUserMoney': {
      return updateUserMoney(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    case 'getGoodsList': {
      return getGoodsList(event)
    }
    case 'updateGoodsList': {
      return getGoodsList(event)
    }
    default: {
      return
    }
  }
}

async function getUser(event) {
  const { OPENID } = cloud.getWXContext()
  let data = {}
  await db.collection('user').where({
    _openid: OPENID
  }).get().then(res=>{
    if(res.data.length>0){
      data = res.data
    }
  })
  return {
    data,
    OPENID
  }
}

async function wenti(event) {
  let data={}
  await db.collection('_chengyu').where({
    _id: event.id
  }).get().then(res=>{
    if(res.data.length>0){
      data = res.data
    }
  })
  return {
    event,
    data
  }
}
async function getGoodsList(event) {
  let data=[]
  await db.collection('goods').get().then(res=>{
    if(res.data.length>0){
      data = res.data
    }
  })
  return {
    data
  }
}
async function updateGoodsList(event) {
  let data=[]
  await db.collection('goods').where({
    level: event.level
  }).get().then(res=>{
    if(res.data.length>0){
      data = res.data
    }
  })
  return {
    data
  }
}
async function updateUser(event) {
  const { OPENID } = cloud.getWXContext()
  const {level, goldCoin, money,userName, telNumber,provinceCity,detailAddress,tagName,goodsRecord} = event
  const userAddress = {userName,telNumber,provinceCity,detailAddress,tagName}
  const user = db.collection('user')//选取数据库
  const thisID = user.where({'_openid':OPENID})
  return thisID.get().then(async res=>{
    if(res.data.length>0){ 
      const item = await thisID.update({
        data: {
          level,
          goldCoin,
          money,
          goodsRecord,
          userAddress
        }
      })
      if(item.errMsg === 'collection.update:ok'){
        return thisID.get().then(it=>{
          return {
            event,
            data: it.data[0]
          }
        })
      }
      
    }
  })
}
async function updateUserMoney(event) {
  const { OPENID } = cloud.getWXContext()
  const {money} = event
  const user = db.collection('user')//选取数据库
  const thisID = user.where({'_openid':OPENID})
  return thisID.get().then(async res=>{
    if(res.data.length>0){ 
      const item = await thisID.update({
        data: {
          money
        }
      })
      if(item.errMsg === 'collection.update:ok'){
        return thisID.get().then(it=>{
          return {
            event,
            data: it.data[0]
          }
        })
      }
      
    }
  })
}

async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  })
}
