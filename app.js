import gulpError from './utils/gulpError';

// 初始化云开发
wx.cloud.init({
  env: 'your-env-id', // 替换为实际云环境ID
  traceUser: true
});

App({
  globalData: {
    baseURL: 'https://your-api-domain.com', // 替换为实际API地址
    userInfo: null,
    token: null,
    isCheckingLogin: false
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
  },

  onShow() {
    if (gulpError !== 'gulpErrorPlaceHolder') {
      wx.redirectTo({
        url: `/pages/gulp-error/index?gulpError=${gulpError}`,
      });
    }
  },

  async checkLoginStatus() {
    if (this.globalData.isCheckingLogin) return;
    
    try {
      this.globalData.isCheckingLogin = true;
      const token = wx.getStorageSync('token');
      
      if (!token) {
        this.redirectToLogin();
        return;
      }

      this.globalData.token = token;
      
      // 验证token是否有效
      const checkResult = await this.checkToken(token);
      if (!checkResult) {
        this.clearLoginStatus();
        this.redirectToLogin();
      }
    } catch (error) {
      console.error('登录状态检查失败:', error);
      this.redirectToLogin();
    } finally {
      this.globalData.isCheckingLogin = false;
    }
  },

  async checkToken(token) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'checkToken',
        data: { token }
      });
      return res.result && res.result.valid;
    } catch (error) {
      console.error('Token验证失败:', error);
      return false;
    }
  },

  // 设置全局token
  setToken(token) {
    this.globalData.token = token;
    wx.setStorageSync('token', token);
  },

  // 清除登录状态
  clearLoginStatus() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
  },

  redirectToLogin() {
    const currentPages = getCurrentPages();
    const currentRoute = currentPages[currentPages.length - 1]?.route || '';
    
    // 如果当前已经在登录页，不需要重定向
    if (currentRoute === 'pages/login/login') {
      return;
    }

    wx.redirectTo({
      url: '/pages/login/login'
    });
  }
});