// pages/index/index.js
Page({
  data: {
    activities: [
      {
        id: 1,
        title: '周末羽毛球活动',
        date: '2023-06-10',
        time: '14:00-16:00',
        location: '市体育中心羽毛球馆',
        maxParticipants: 10,
        currentParticipants: 6,
        creator: '张三',
        status: 'ongoing' // ongoing, full, ended
      },
      {
        id: 2,
        title: '工作日晚间羽毛球',
        date: '2023-06-15',
        time: '19:00-21:00',
        location: '市体育中心羽毛球馆',
        maxParticipants: 8,
        currentParticipants: 8,
        creator: '李四',
        status: 'full' // ongoing, full, ended
      },
      {
        id: 3,
        title: '周日早晨羽毛球',
        date: '2023-06-18',
        time: '09:00-11:00',
        location: '市体育中心羽毛球馆',
        maxParticipants: 12,
        currentParticipants: 5,
        creator: '王五',
        status: 'ongoing' // ongoing, full, ended
      }
    ]
  },

  onLoad: function (options) {
    // 页面加载时执行
  },

  onShow: function () {
    // 页面显示时执行
  },

  // 跳转到创建活动页面
  navigateToCreate: function () {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },

  // 跳转到活动详情页面
  navigateToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 获取活动状态对应的标签类型
  getTagType: function (status) {
    switch (status) {
      case 'ongoing':
        return 'primary';
      case 'full':
        return 'warning';
      case 'ended':
        return 'danger';
      default:
        return 'default';
    }
  },

  // 获取活动状态对应的文本
  getStatusText: function (status) {
    switch (status) {
      case 'ongoing':
        return '报名中';
      case 'full':
        return '已满员';
      case 'ended':
        return '已结束';
      default:
        return '未知';
    }
  }
})