const cloud = require('wx-server-sdk');
const jwt = require('jsonwebtoken');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const JWT_SECRET = 'your-jwt-secret'; // 在实际部署时应该使用环境变量

exports.main = async (event, context) => {
  const { token } = event;
  
  if (!token) {
    return {
      valid: false,
      message: 'Token不能为空'
    };
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 检查token是否过期
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return {
        valid: false,
        message: 'Token已过期'
      };
    }

    // 验证用户是否存在
    const db = cloud.database();
    const user = await db.collection('users').doc(decoded.userId).get();
    
    if (!user.data) {
      return {
        valid: false,
        message: '用户不存在'
      };
    }

    return {
      valid: true,
      userId: decoded.userId,
      openid: decoded.openid
    };
  } catch (error) {
    console.error('Token验证失败:', error);
    return {
      valid: false,
      message: error.message
    };
  }
};