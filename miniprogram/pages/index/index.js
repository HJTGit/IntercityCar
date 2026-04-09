// pages/index/index.js

Page({
  data: {

  },

  onLoad() {
    // 不再强制设置为乘客，保持全局角色状态
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
