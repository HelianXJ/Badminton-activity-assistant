// pages/create/create.js
Page({
  data: {
    form: {
      title: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: 8,
      description: ''
    },
    rules: {
      title: [
        { required: true, message: '请输入活动标题' },
        { max: 50, message: '标题最多50个字符' }
      ],
      date: [{ required: true, message: '请选择活动日期' }],
      time: [{ required: true, message: '请选择活动时间' }],
      location: [{ required: true, message: '请输入活动地点' }],
      maxParticipants: [
        { required: true, message: '请选择最大参与人数' },
        { min: 2, message: '参与人数至少2人' },
        { max: 20, message: '参与人数最多20人' }
      ],
      description: [
        { required: true, message: '请输入活动描述' },
        { max: 500, message: '描述最多500个字符' }
      ]
    },
    minDate: new Date().getTime(),
    maxDate: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30天后
    visible: {
      date: false,
      time: false
    },
    submitLoading: false
  },

  // 显示日期选择器
  showDatePicker() {
    this.setData({
      'visible.date': true
    });
  },

  // 显示时间选择器
  showTimePicker() {
    this.setData({
      'visible.time': true
    });
  },

  // 日期选择器确认
  onConfirmDate(e) {
    this.setData({
      'form.date': e.detail.value,
      'visible.date': false
    });
  },

  // 时间选择器确认
  onConfirmTime(e) {
    this.setData({
      'form.time': e.detail.value,
      'visible.time': false
    });
  },

  // 关闭选择器
  onClose(e) {
    const { source } = e.currentTarget.dataset;
    this.setData({
      [`visible.${source}`]: false
    });
  },

  // 输入框变化处理
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  // 步进器变化处理
  onStepperChange(e) {
    this.setData({
      'form.maxParticipants': e.detail.value
    });
  },

  // 处理返回按钮点击
  onClickLeftIcon() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 表单提交
  onSubmit() {
    const { form } = this.data;
    
    // 表单验证
    const errors = [];
    Object.keys(this.data.rules).forEach(key => {
      const rules = this.data.rules[key];
      const value = form[key];

      rules.forEach(rule => {
        if (rule.required && !value) {
          errors.push(rule.message);
        }
        if (rule.max && value && value.length > rule.max) {
          errors.push(rule.message);
        }
        if (rule.min && value && value < rule.min) {
          errors.push(rule.message);
        }
        if (rule.max && typeof value === 'number' && value > rule.max) {
          errors.push(rule.message);
        }
      });
    });

    if (errors.length > 0) {
      wx.showToast({
        title: errors[0],
        icon: 'none'
      });
      return;
    }

    this.setData({ submitLoading: true });

    // 检查用户登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      this.setData({ submitLoading: false });
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return wx.navigateTo({
        url: '/pages/login/login'
      });
    }

    // 准备请求数据
    const activityData = {
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      max_participants: form.maxParticipants,
      description: form.description,
      sport_type: 'badminton' // 固定为羽毛球活动
    };

    // 获取API基础URL
    const app = getApp();
    const baseURL = app.globalData.baseURL || 'https://your-api-domain.com';

    // 调用创建活动API
    wx.request({
      url: `${baseURL}/api/activities`,
      method: 'POST',
      data: activityData,
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        this.setData({ submitLoading: false });
        
        if (res.statusCode === 201) {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              // 返回活动列表页并刷新
              const pages = getCurrentPages();
              if (pages.length >= 2) {
                const prevPage = pages[pages.length - 2];
                prevPage.onLoad && prevPage.onLoad();
              }
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            }
          });
        } else {
          wx.showToast({
            title: res.data.message || '创建失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        this.setData({ submitLoading: false });
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
        console.error('API请求失败:', err);
      }
    });
  }
})
