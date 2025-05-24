const cloud = require('wx-server-sdk');
const jwt = require('jsonwebtoken');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const JWT_SECRET = 'your-jwt-secret'; // 在实际部署时应该使用环境变量

exports.main = async (event, context) => {
  const { OPENID, APPID } = cloud.getWXContext();
  const { userInfo } = event;

  try {
    // 查找或创建用户
    const userCollection = db.collection('users');
    let user = await userCollection.where({
      openid: OPENID
    }).get();

    if (!user.data || user.data.length === 0) {
      // 新用户，创建用户记录
      const userData = {
        openid: OPENID,
        appid: APPID,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        ...userInfo
      };

      const result = await userCollection.add({
        data: userData
      });

      user = {
        _id: result._id,
        ...userData
      };
    } else {
      user = user.data[0];
      
      // 更新用户信息
      if (userInfo) {
        await userCollection.doc(user._id).update({
          data: {
            ...userInfo,
            updateTime: db.serverDate()
          }
        });
      }
    }

    // 生成token
    const token = jwt.sign(
      {
        openid: OPENID,
        userId: user._id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // 30天过期
      },
      JWT_SECRET
    );

    return {
      token,
      userId: user._id,
      ...userInfo
    };
  } catch (error) {
    console.error('登录失败:', error);
    return {
      error: error.message
    };
  }
};