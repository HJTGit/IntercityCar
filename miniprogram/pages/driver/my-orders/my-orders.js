// pages/driver/my-orders/my-orders.js
const api = require('../../../utils/api.js');
const utils = require('../../../utils/utils.js');
const constants = require('../../../utils/constants.js');

Page({
  data: {
    currentRole: 'passenger',
    userInfo: {},
    showEditModal: false,
    editData: {
      avatar: '',
      nickname: '',
      phone: ''
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
    this.loadUserInfo();
  },

  onShow() {
    const app = getApp();
    const role = app.globalData.role || wx.getStorageSync('role') || 'passenger';
    this.setData({ currentRole: role });
    this.loadUserInfo();

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

  // 加载用户信息
  loadUserInfo() {
    const app = getApp();
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo });
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

  // 编辑用户信息
  onEditUserInfo() {
    const { userInfo } = this.data;
    this.setData({
      showEditModal: true,
      editData: {
        avatar: userInfo.avatar || '',
        nickname: userInfo.nickname || '',
        phone: userInfo.phone || ''
      }
    });
  },

  // 关闭编辑弹窗
  onCloseEditModal() {
    this.setData({ showEditModal: false });
  },

  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      'editData.avatar': avatarUrl
    });
  },

  // 昵称输入
  onNicknameBlur(e) {
    const { value } = e.detail;
    this.setData({
      'editData.nickname': value
    });
  },

  // 手机号输入
  onPhoneInput(e) {
    const { value } = e.detail;
    this.setData({
      'editData.phone': value
    });
  },

  // 保存用户信息
  async onSaveUserInfo() {
    const { avatar, nickname, phone } = this.data.editData;

    if (!nickname) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '保存中...' });
      const res = await api.registerUser({
        nickname: nickname,
        avatar: avatar,
        phone: phone,
        name: ''
      });
      wx.hideLoading();

      if (res.code === 1000) {
        const app = getApp();
        app.globalData.userInfo = res.data;
        app.globalData.role = res.data.role || 'passenger';
        wx.setStorageSync('userInfo', res.data);
        wx.setStorageSync('role', res.data.role || 'passenger');

        this.setData({
          showEditModal: false,
          userInfo: res.data
        });
        wx.showToast({ title: '保存成功', icon: 'success' });
      } else {
        wx.showToast({ title: res.message || '保存失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '网络请求失败', icon: 'none' });
      console.error('保存失败:', err);
    }
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

  // 完成行程 - 直接跳转详情页
  onCompleteOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${orderId}&role=driver`
    });
  }
});
