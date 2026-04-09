// pages/passenger/create-order/create-order.js
const api = require('../../../utils/api.js');
const utils = require('../../../utils/utils.js');

Page({
  data: {
    // 出发地
    startLocation: {
      name: '',
      latitude: 0,
      longitude: 0
    },
    // 目的地
    endLocation: {
      name: '',
      latitude: 0,
      longitude: 0
    },
    // 预约时间（日期和时间分开）
    dateValue: '',
    dateText: '',
    timeValue: '',
    timeText: '',
    appointmentTime: '',
    // 乘车人数
    passengerCount: 1,
    // 备注
    remark: ''
  },

  onLoad() {
    // 获取用户信息
    const app = getApp();
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};

    // 设置用户信息
    this.setData({
      passengerName: userInfo.nickname || userInfo.name || '乘客',
      passengerPhone: userInfo.phone || ''
    });

    // 设置默认日期（今天）
    const today = new Date();
    const defaultDate = this.formatDate(today);
    this.setData({ dateValue: defaultDate, dateText: defaultDate });

    // 设置默认时间（当前时间+1小时，向上取整到整点）
    today.setHours(today.getHours() + 1);
    today.setMinutes(0);
    const defaultTime = this.formatTime(today);
    this.setData({ timeValue: defaultTime, timeText: defaultTime });

    // 获取当前位置
    this.getCurrentLocation();
  },

  // 获取当前位置
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          startLocation: {
            name: '我的位置',
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
      },
      fail: () => {
        this.setData({
          startLocation: {
            name: '点击选择出发地',
            latitude: 0,
            longitude: 0
          }
        });
      }
    });
  },

  onBack() {
    wx.navigateBack();
  },

  // 选择地点
  onSelectLocation(e) {
    const type = e.currentTarget.dataset.type;
    const isStart = type === 'start';

    // 模拟器环境用输入框模拟
    const mockLocations = {
      start: { name: '北京站', latitude: 39.904, longitude: 116.408 },
      end: { name: '上海虹桥站', latitude: 31.194, longitude: 121.320 }
    };

    // 先尝试使用地图选择
    wx.chooseLocation({
      success: (res) => {
        if (res.name || res.address) {
          const location = {
            name: res.name || res.address,
            latitude: res.latitude,
            longitude: res.longitude
          };
          if (isStart) {
            this.setData({ startLocation: location });
          } else {
            this.setData({ endLocation: location });
          }
        }
      },
      fail: () => {
        // 地图选择失败（模拟器），使用模拟数据
        const location = mockLocations[type];
        if (isStart) {
          this.setData({ startLocation: location });
        } else {
          this.setData({ endLocation: location });
        }
        wx.showToast({ title: '已使用默认地点', icon: 'none', duration: 1500 });
      }
    });
  },

  // 日期选择
  onDateChange(e) {
    const value = e.detail.value;
    this.setData({
      dateValue: value,
      dateText: value
    });
    this.updateAppointmentTime();
  },

  // 时间选择
  onTimeChange(e) {
    const value = e.detail.value;
    this.setData({
      timeValue: value,
      timeText: value
    });
    this.updateAppointmentTime();
  },

  // 更新完整预约时间
  updateAppointmentTime() {
    const { dateValue, timeValue } = this.data;
    if (dateValue && timeValue) {
      this.setData({
        appointmentTime: `${dateValue} ${timeValue}`
      });
    }
  },

  // 格式化日期 YYYY-MM-DD
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 格式化时间 HH:mm
  formatTime(date) {
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  },

  // 减少人数
  onDecrement() {
    if (this.data.passengerCount > 1) {
      this.setData({
        passengerCount: this.data.passengerCount - 1
      });
    }
  },

  // 增加人数
  onIncrement() {
    if (this.data.passengerCount < 4) {
      this.setData({
        passengerCount: this.data.passengerCount + 1
      });
    }
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  // 提交订单
  async onSubmit() {
    const { startLocation, endLocation, appointmentTime, passengerCount, remark } = this.data;

    // 验证表单
    if (!startLocation.name || startLocation.name === '点击选择出发地') {
      utils.showError('请选择出发地');
      return;
    }

    if (!endLocation.name || endLocation.name === '点击选择目的地') {
      utils.showError('请选择目的地');
      return;
    }

    if (!appointmentTime) {
      utils.showError('请选择预约时间');
      return;
    }

    const orderData = {
      passengerName: this.data.passengerName || '乘客',
      passengerPhone: this.data.passengerPhone || '13800138000',
      startLocation: startLocation,
      endLocation: endLocation,
      appointmentTime: appointmentTime + ':00',
      passengerCount: passengerCount,
      remark: remark
    };

    try {
      utils.showLoading('提交中...');
      const res = await api.createOrder(orderData);
      utils.hideLoading();

      if (res.code === 1000) {
        utils.showSuccess('订单创建成功');
        // 跳转到订单列表
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/passenger/order-list/order-list'
          });
        }, 1500);
      } else {
        utils.showError(res.message || '创建失败');
      }
    } catch (err) {
      utils.hideLoading();
      utils.showError('网络请求失败');
      console.error('创建订单失败:', err);
    }
  }
});
