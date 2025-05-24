const app = getApp();

Page({
  data: {
    isLoading: false
  },

  onLoad() {
    // 检查是否已经登录
    const token = wx.getStorageSync('token');
    if (token) {
      this.checkExistingToken(token);
    }
  },

  async checkExistingToken(token) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'checkToken',
        data: { token }
      });

      if (res.result && res.result.valid) {
        this.navigateBack();
      }
    } catch (error) {
      console.error('Token验证失败:', error);
    }
  },

  async getUserProfile(e) {
    if (this.data.isLoading) return;
    
    this.setData({ isLoading: true });
    
    try {
      // 获取用户信息
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善会员资料' // 声明获取用户个人信息后的用途
      });
      
      await this.handleLogin(userInfo);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'error'
      });
      this.setData({ isLoading: false });
    }
  },

  async handleLogin(userInfo) {
    try {
      console.log('准备调用登录云函数，用户信息:', userInfo);
      
      // 调用登录云函数
      const loginResult = await wx.cloud.callFunction({
        name: 'login',
        data: { 
          userInfo: {
            ...userInfo,
            openId: wx.getStorageSync('openid') || '' // 确保传递openid
          }
        }
      });

      console.log('云函数返回结果:', loginResult);

      if (!loginResult.result) {
        throw new Error('云函数返回结果异常');
      }

      if (loginResult.result.code !== 200) {
        throw new Error(loginResult.result.message || '登录失败');
      }

      // 保存登录状态
      app.globalData.userInfo = loginResult.result.data.userInfo;
      app.setToken(loginResult.result.data.token);

      // 显示成功提示
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });

      // 返回之前的页面或首页
      this.navigateBack();

    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'error',
        duration: 2000
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  navigateBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  }
});