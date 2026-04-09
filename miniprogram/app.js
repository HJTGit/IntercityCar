// app.js
const api = require('./utils/api.js');

App({
  globalData: {
    userInfo: null,
    openid: '',
    role: 'passenger', // passenger or driver
    apiBase: 'http://192.168.0.97:5000/api'
  },

  onLaunch() {
    // 初始化 openid
    let openid = wx.getStorageSync('openid');
    if (!openid) {
      openid = 'test_user_' + Date.now();
      wx.setStorageSync('openid', openid);
    }
    this.globalData.openid = openid;

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;

    // 注册/同步用户信息
    this.syncUserInfo();
  },

  // 同步用户信息到服务器（仅同步已有数据，不主动注册）
  async syncUserInfo() {
    try {
      // 从本地存储获取已有用户信息
      const localUserInfo = wx.getStorageSync('userInfo');
      if (!localUserInfo || !localUserInfo.nickname) {
        // 没有用户信息，等待登录弹窗
        return;
      }

      const res = await api.registerUser({
        nickname: localUserInfo.nickname || '用户',
        avatar: localUserInfo.avatar || '',
        phone: localUserInfo.phone || '',
        name: localUserInfo.name || ''
      });

      if (res.code === 1000 && res.data) {
        const serverRole = res.data.role || 'passenger';
        this.globalData.role = serverRole;
        wx.setStorageSync('role', serverRole);
        this.globalData.userInfo = res.data;
      }
    } catch (err) {
      console.log('同步用户信息失败', err);
      const localRole = wx.getStorageSync('role') || 'passenger';
      this.globalData.role = localRole;
    }
  },

  setRole(role) {
    this.globalData.role = role;
    wx.setStorageSync('role', role);

    // 同步到服务器
    api.updateRole(role).catch(err => {
      console.log('同步角色失败', err);
    });
  },

  getOpenid() {
    return this.globalData.openid || wx.getStorageSync('openid');
  }
})
