// config.js - 配置文件
module.exports = {
  // API 配置
  // TODO: 如果手机访问不了，改为电脑的局域网IP，如 http://192.168.x.x:5000/api
  apiBase: 'http://192.168.0.97:5000/api',

  // 分页配置
  pageSize: 10,

  // 订单状态
  orderStatus: {
    pending: 'pending',
    accepted: 'accepted',
    completed: 'completed',
    cancelled: 'cancelled'
  },

  // 角色
  role: {
    passenger: 'passenger',
    driver: 'driver'
  }
}
