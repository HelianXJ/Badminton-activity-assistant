// pages/detail/detail.js
Page({
  data: {
    activity: null,
    isCreator: false,
    hasJoined: false,
    loading: true
  },

  onLoad: function (options) {
    // 模拟从服务器获取数据
    const activityId = options.id;
    // 这里应该是从服务器获取数据，这里使用模拟数据
    const mockActivity = {
      id: parseInt(activityId),
      title: '周末羽毛球活动',
      date: '2023-06-10',
      time: '14:00-16:00',
      location: '市体育中心羽毛球馆',
      maxParticipants: 10,
      currentParticipants: 6,
      creator: {
        id: 1,
        name: '张三',
        avatar: '/assets/images/avatar.png'
      },
      description: '周末一起打羽毛球，欢迎各位羽毛球爱好者参加！场地已预订，费用AA制，每人预计30元。请准时到场，带好装备。',
      status: 'ongoing',
      participants: [
        {
          id: 1,
          name: '张三',
          avatar: '/assets/images/avatar.png',
          joinTime: '2023-06-01 12:00:00'
        },
        {
          id: 2,
          name: '李四',
          avatar: '/assets/images/avatar.png',
          joinTime: '2023-06-01 12:30:00'
        }
      ]
    };

    // 模拟加载延迟
    setTimeout(() => {
      this.setData({
        activity: mockActivity,
        loading: false,
        // 模拟当前用户是否是创建者
        isCreator: mockActivity.creator.id === 1,
        // 模拟当前用户是否已参加
        hasJoined: mockActivity.participants.some(p => p.id === 1)
      });
    }, 500);
  },

  // 参加活动
  handleJoin: function () {
    if (this.data.activity.currentParticipants >= this.data.activity.maxParticipants) {
      wx.showToast({
        title: '活动已满员',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '正在报名...',
    });

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading();
      
      const newParticipant = {
        id: Date.now(), // 模拟新用户ID
        name: '当前用户',
        avatar: '/assets/images/avatar.png',
        joinTime: new Date().toISOString()
      };

      const activity = this.data.activity;
      activity.participants.push(newParticipant);
      activity.currentParticipants += 1;

      this.setData({
        activity,
        hasJoined: true
      });

      wx.showToast({
        title: '报名成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 退出活动
  handleQuit: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出该活动吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在退出...',
          });

          // 模拟API调用
          setTimeout(() => {
            wx.hideLoading();

            const activity = this.data.activity;
            // 移除当前用户
            activity.participants = activity.participants.filter(p => p.id !== 1);
            activity.currentParticipants -= 1;

            this.setData({
              activity,
              hasJoined: false
            });

            wx.showToast({
              title: '已退出活动',
              icon: 'success'
            });
          }, 1000);
        }
      }
    });
  },

  // 取消活动
  handleCancel: function () {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该活动吗？取消后不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在取消...',
          });

          // 模拟API调用
          setTimeout(() => {
            wx.hideLoading();
            
            const activity = this.data.activity;
            activity.status = 'ended';

            this.setData({
              activity
            });

            wx.showToast({
              title: '活动已取消',
              icon: 'success'
            });
          }, 1000);
        }
      }
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