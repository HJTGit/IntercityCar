// pages/driver/order-hall/order-hall.js
const api = require('../../../utils/api.js');
const utils = require('../../../utils/utils.js');

Page({
  data: {
    // 当前角色
    currentRole: 'driver',
    // 筛选
    startFilterOptions: ['全部', '北京', '上海', '杭州'],
    startFilterText: '出发地',
    startFilterValue: '',
    startFilterIndex: 0,

    endFilterOptions: ['全部', '北京', '上海', '杭州'],
    endFilterText: '目的地',
    endFilterValue: '',
    endFilterIndex: 0,

    // 订单列表
    orders: [],
    loading: false
  },

  onLoad() {
    this.checkRole();
  },

  onShow() {
    this.checkRole();
    this.loadOrders();
  },

  onPullDownRefresh() {
    this.loadOrders();
  },

  // 检查角色
  checkRole() {
    const app = getApp();
    const role = app.globalData.role || wx.getStorageSync('role') || 'passenger';
    this.setData({ currentRole: role });
  },

  // 切换为司机
  onSwitchToDriver() {
    const app = getApp();
    app.setRole('driver');
    this.setData({ currentRole: 'driver' });
    this.loadOrders();
  },

  // 出发地筛选
  onStartFilterChange(e) {
    const index = e.detail.value;
    this.setData({
      startFilterIndex: index,
      startFilterText: this.data.startFilterOptions[index],
      startFilterValue: index === 0 ? '' : this.data.startFilterOptions[index]
    });
    this.loadOrders();
  },

  // 目的地筛选
  onEndFilterChange(e) {
    const index = e.detail.value;
    this.setData({
      endFilterIndex: index,
      endFilterText: this.data.endFilterOptions[index],
      endFilterValue: index === 0 ? '' : this.data.endFilterOptions[index]
    });
    this.loadOrders();
  },

  // 加载订单列表
  async loadOrders() {
    this.setData({ loading: true });

    try {
      // 只获取待接单的订单
      const res = await api.getOrders('driver', 'pending');

      if (res.code === 1000) {
        let orders = (res.data.list || []).map(order => {
          return {
            ...order,
            appointmentTimeDisplay: utils.getRelativeTime(order.appointmentTime)
          };
        });

        // 本地筛选
        if (this.data.startFilterValue) {
          orders = orders.filter(o =>
            o.startLocation.name.includes(this.data.startFilterValue)
          );
        }
        if (this.data.endFilterValue) {
          orders = orders.filter(o =>
            o.endLocation.name.includes(this.data.endFilterValue)
          );
        }

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

  // 接单
  async onAcceptOrder(e) {
    const orderId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认接单',
      content: '确定要接下这个订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            utils.showLoading('接单中...');
            const result = await api.acceptOrder(orderId);
            utils.hideLoading();

            if (result.code === 1000) {
              utils.showSuccess('接单成功');
              // 跳转到我的接单页面
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/driver/my-orders/my-orders'
                });
              }, 1500);
            } else {
              utils.showError(result.message || '接单失败');
            }
          } catch (err) {
            utils.hideLoading();
            utils.showError('网络请求失败');
            console.error('接单失败:', err);
          }
        }
      }
    });
  }
});
