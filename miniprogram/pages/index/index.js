// pages/index/index.js

Page({
  data: {

  },

  onLoad() {
    // 默认设置为乘客模式
    const app = getApp();
    app.setRole('passenger');
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
