// constants.js - 常量
module.exports = {
  // 订单状态映射
  statusMap: {
    pending: { text: '待接单', class: 'tag-pending' },
    accepted: { text: '已接单', class: 'tag-accepted' },
    completed: { text: '已完成', class: 'tag-completed' },
    cancelled: { text: '已取消', class: 'tag-cancelled' }
  },

  // 状态标签数组（用于筛选）
  statusFilters: [
    { value: '', text: '全部' },
    { value: 'pending', text: '待接单' },
    { value: 'accepted', text: '已接单' },
    { value: 'completed', text: '已完成' },
    { value: 'cancelled', text: '已取消' }
  ],

  // 乘客状态筛选（进行中）
  passengerStatusFilters: [
    { value: '', text: '全部' },
    { value: 'pending', text: '待接单' },
    { value: 'accepted', text: '已接单' },
    { value: 'completed', text: '已完成' }
  ],

  // 司机状态筛选（进行中）
  driverStatusFilters: [
    { value: '', text: '全部' },
    { value: 'accepted', text: '进行中' },
    { value: 'completed', text: '已完成' }
  ],

  // 人数选项
  passengerCountOptions: [1, 2, 3, 4],

  // 日期格式
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  datetimeFormat: 'YYYY-MM-DD HH:mm'
}
