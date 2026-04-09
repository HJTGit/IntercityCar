// pages/driver/my-orders/my-orders.js
const api = require('../../../utils/api.js');
const utils = require('../../../utils/utils.js');
const constants = require('../../../utils/constants.js');

Page({
  data: {
    currentRole: 'passenger',
    userInfo: {
      name: '乘客',
      phone: '138****8000'
    },
    // 状态筛选
    statusFilters: constants.driverStatusFilters,
    currentStatus: '',
    // 订单列表
    orders: [],
    loading: false
  },

  onLoad() {
    const app = getApp();
    const role = app.globalData.role || wx.getStorageSync('role') || 'passenger';
    this.setData({ currentRole: role });
  },

  onShow() {
    const app = getApp();
    const role = app.globalData.role || wx.getStorageSync('role') || 'passenger';
    this.setData({ currentRole: role });

    if (role === 'driver') {
      this.loadOrders();
    }
  },

  onPullDownRefresh() {
    if (this.data.currentRole === 'driver') {
      this.loadOrders();
    } else {
      wx.stopPullDownRefresh();
    }
  },

  // 切换到司机模式
  onSwitchToDriver() {
    const app = getApp();
    app.setRole('driver');
    this.setData({ currentRole: 'driver' });
  },

  // 切换到乘客模式
  onSwitchToPassenger() {
    const app = getApp();
    app.setRole('passenger');
    this.setData({ currentRole: 'passenger' });
  },

  // 切换状态筛选
  onStatusChange(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ currentStatus: status });
    this.loadOrders();
  },

  // 加载订单列表
  async loadOrders() {
    this.setData({ loading: true });

    try {
      const res = await api.getOrders('driver', this.data.currentStatus);

      if (res.code === 1000) {
        const orders = (res.data.list || []).map(order => {
          return {
            ...order,
            appointmentTimeDisplay: utils.getRelativeTime(order.appointmentTime),
            statusText: constants.statusMap[order.status]?.text || order.status,
            statusClass: constants.statusMap[order.status]?.class || '',
            passengerPhoneDisplay: order.passengerPhone ? utils.maskPhone(order.passengerPhone) : ''
          };
        });

        this.setData({ orders });
      } else {
        utils.showError(res.message || '加载失败');
      }
    } catch (err) {
      console.error('加载订单失败:', err);
      utils.showError('网络请求失败');
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  // 点击订单
  onOrderTap(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${orderId}&role=driver`
    });
  },

  // 完成行程
  async onCompleteOrder(e) {
    const orderId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认完成',
      content: '确定已完成行程吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            utils.showLoading('处理中...');
            const result = await api.completeOrder(orderId);
            utils.hideLoading();

            if (result.code === 1000) {
              utils.showSuccess('订单已完成');
              this.loadOrders();
            } else {
              utils.showError(result.message || '操作失败');
            }
          } catch (err) {
            utils.hideLoading();
            utils.showError('网络请求失败');
            console.error('完成订单失败:', err);
          }
        }
      }
    });
  }
});
