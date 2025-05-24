Page({
  data: {
    activeTab: 0,
    tabs: ['用户协议', '隐私政策']
  },

  onTabChange(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
  },

  onShareAppMessage() {
    return {
      title: '羽毛球约球小程序用户协议与隐私政策',
      path: '/pages/privacy/privacy'
    };
  }
});