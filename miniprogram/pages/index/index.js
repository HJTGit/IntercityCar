// pages/index/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    showLogin: false,
    loginData: {
      avatar: '',
      nickname: '',
      phone: ''
    }
  },

  onLoad() {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const app = getApp();
    const userInfo = app.globalData.userInfo;

    // 如果用户信息不完整，显示登录弹窗
    if (!userInfo || !userInfo.nickname) {
      this.setData({ showLogin: true });
    }
  },

  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      'loginData.avatar': avatarUrl
    });
  },

  // 昵称输入
  onNicknameBlur(e) {
    const { value } = e.detail;
    this.setData({
      'loginData.nickname': value
    });
  },

  // 手机号输入
  onPhoneInput(e) {
    const { value } = e.detail;
    this.setData({
      'loginData.phone': value
    });
  },

  // 完成注册
  async onLoginComplete() {
    const { avatar, nickname, phone } = this.data.loginData;

    if (!nickname) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '注册中...' });
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

        this.setData({ showLogin: false });
        wx.showToast({ title: '注册成功', icon: 'success' });
      } else {
        wx.showToast({ title: res.message || '注册失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '网络请求失败', icon: 'none' });
      console.error('注册失败:', err);
    }
  },

  // 跳转到下单页
  onGoCreateOrder() {
    wx.navigateTo({
      url: '/pages/passenger/create-order/create-order'
    });
  },

  // 跳转到订单列表
  onGoOrderList() {
    wx.switchTab({
      url: '/pages/passenger/order-list/order-list'
    });
  }
});
