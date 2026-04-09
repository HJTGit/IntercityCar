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

  // 同步用户信息到服务器
  async syncUserInfo() {
    try {
      const res = await api.registerUser({
        nickname: '用户',
        name: '',
        phone: ''
      });

      if (res.code === 1000 && res.data) {
        // 同步服务器返回的角色
        const serverRole = res.data.role || 'passenger';
        this.globalData.role = serverRole;
        wx.setStorageSync('role', serverRole);
        this.globalData.userInfo = res.data;
      }
    } catch (err) {
      console.log('同步用户信息失败', err);
      // 失败时使用本地默认角色
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
