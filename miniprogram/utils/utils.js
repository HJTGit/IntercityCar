// utils.js - 工具函数

/**
 * 格式化日期时间
 */
function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间
 */
function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * 获取相对时间描述
 */
function getRelativeTime(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24));

  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  if (diffDays === 0) {
    return `今天 ${hour}:${minute}`;
  } else if (diffDays === 1) {
    return `明天 ${hour}:${minute}`;
  } else if (diffDays === -1) {
    return `昨天 ${hour}:${minute}`;
  } else {
    return formatDateTime(dateString);
  }
}

/**
 * 手机号脱敏
 */
function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

/**
 * 显示成功提示
 */
function showSuccess(title = '成功') {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000
  });
}

/**
 * 显示错误提示
 */
function showError(title = '出错了') {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  });
}

/**
 * 显示加载提示
 */
function showLoading(title = '加载中') {
  wx.showLoading({
    title: title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

module.exports = {
  formatDateTime,
  formatDate,
  formatTime,
  getRelativeTime,
  maskPhone,
  showSuccess,
  showError,
  showLoading,
  hideLoading
};
