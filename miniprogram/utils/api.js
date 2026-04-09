// api.js - API 请求封装
const config = require('./config.js');

/**
 * 封装请求
 */
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const app = getApp();
    const openid = app.globalData.openid || wx.getStorageSync('openid');

    wx.showLoading({ title: '加载中...' });

    wx.request({
      url: config.apiBase + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'X-OpenID': openid
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        wx.hideLoading();
        reject(err);
      }
    });
  });
}

/**
 * 健康检查
 */
function healthCheck() {
  return request('/health', 'GET');
}

// ============ 用户相关 ============

/**
 * 获取用户信息
 */
function getUserInfo() {
  return request('/user/info', 'GET');
}

/**
 * 注册/更新用户信息
 */
function registerUser(userData) {
  return request('/user/register', 'POST', userData);
}

/**
 * 更新用户信息
 */
function updateUser(userData) {
  return request('/user/update', 'POST', userData);
}

/**
 * 更新用户角色
 */
function updateRole(role) {
  return request('/user/role', 'POST', { role });
}

// ============ 订单相关 ============

/**
 * 创建订单
 */
function createOrder(orderData) {
  return request('/order/create', 'POST', orderData);
}

/**
 * 获取订单列表
 * @param {string} role - passenger 或 driver
 * @param {string} status - 订单状态
 */
function getOrders(role, status = '') {
  let url = `/orders?role=${role}`;
  if (status) {
    url += `&status=${status}`;
  }
  return request(url, 'GET');
}

/**
 * 获取订单详情
 * @param {number} orderId - 订单ID
 */
function getOrderDetail(orderId) {
  return request(`/order/${orderId}`, 'GET');
}

/**
 * 司机接单
 * @param {number} orderId - 订单ID
 * @param {object} driverData - 司机信息
 */
function acceptOrder(orderId, driverData = {}) {
  return request(`/order/${orderId}/accept`, 'POST', driverData);
}

/**
 * 完成订单
 * @param {number} orderId - 订单ID
 */
function completeOrder(orderId) {
  return request(`/order/${orderId}/complete`, 'POST', {});
}

/**
 * 取消订单
 * @param {number} orderId - 订单ID
 */
function cancelOrder(orderId) {
  return request(`/order/${orderId}/cancel`, 'POST', {});
}

module.exports = {
  healthCheck,
  // 用户
  getUserInfo,
  registerUser,
  updateUser,
  updateRole,
  // 订单
  createOrder,
  getOrders,
  getOrderDetail,
  acceptOrder,
  completeOrder,
  cancelOrder
};
