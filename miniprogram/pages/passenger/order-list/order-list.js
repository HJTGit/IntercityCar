// pages/passenger/order-list/order-list.js
const api = require('../../../utils/api.js');
const utils = require('../../../utils/utils.js');
const constants = require('../../../utils/constants.js');

Page({
  data: {
    // 状态筛选
    statusFilters: constants.passengerStatusFilters,
    currentStatus: '',
    // 订单列表
    orders: [],
    loading: false
  },

  onLoad() {
    // 确保是乘客模式
    const app = getApp();
    if (app.globalData.role !== 'passenger') {
      app.setRole('passenger');
    }
  },

  onShow() {
    // 检查角色
    const app = getApp();
    if (app.globalData.role !== 'passenger') {
      app.setRole('passenger');
    }
    this.loadOrders();
  },

  onPullDownRefresh() {
    this.loadOrders();
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
      const res = await api.getOrders('passenger', this.data.currentStatus);

      if (res.code === 1000) {
        const orders = (res.data.list || []).map(order => {
          return {
            ...order,
            appointmentTimeDisplay: utils.getRelativeTime(order.appointmentTime),
            statusText: constants.statusMap[order.status]?.text || order.status,
            statusClass: constants.statusMap[order.status]?.class || '',
            driverPhoneDisplay: order.driverPhone ? utils.maskPhone(order.driverPhone) : ''
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
      url: `/pages/order-detail/order-detail?id=${orderId}&role=passenger`
    });
  }
});
