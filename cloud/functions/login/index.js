// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { userInfo } = event
  
  // 1. 验证用户信息
  if (!userInfo || !userInfo.nickName) {
    return { code: 400, message: '无效的用户信息' }
  }

  // 2. 生成用户token或session
  // 这里简单返回用户信息，实际项目中应该生成token并保存到数据库
  return {
    code: 200,
    data: {
      userInfo,
      token: 'generated-token', // 实际项目中应该生成唯一token
      expires: Date.now() + 3600 * 1000 // 1小时后过期
    }
  }
}