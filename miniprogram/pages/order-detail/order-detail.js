// pages/order-detail/order-detail.js
const api = require('../../utils/api.js');
const utils = require('../../utils/utils.js');
const constants = require('../../utils/constants.js');

Page({
  data: {
    orderId: null,
    role: 'passenger',
    order: {}
  },

  onLoad(options) {
    if (options.id) {
      this.setData({
        orderId: parseInt(options.id),
        role: options.role || 'passenger'
      });
      this.loadOrderDetail();
    }
  },

  onBack() {
    wx.navigateBack();
  },

  // 加载订单详情
  async loadOrderDetail() {
    try {
      utils.showLoading('加载中...');
      const res = await api.getOrderDetail(this.data.orderId);
      utils.hideLoading();

      if (res.code === 1000) {
        const order = res.data;
        this.setData({
          order: {
            ...order,
            appointmentTimeDisplay: utils.formatDateTime(order.appointmentTime),
            statusText: constants.statusMap[order.status]?.text || order.status,
            statusClass: constants.statusMap[order.status]?.class || '',
            passengerPhoneDisplay: order.passengerPhone ? utils.maskPhone(order.passengerPhone) : '',
            driverPhoneDisplay: order.driverPhone ? utils.maskPhone(order.driverPhone) : ''
          }
        });
      } else {
        utils.showError(res.message || '加载失败');
      }
    } catch (err) {
      utils.hideLoading();
      utils.showError('网络请求失败');
      console.error('加载订单详情失败:', err);
    }
  },

  // 拨打电话
  onCallPhone(e) {
    const phone = e.currentTarget.dataset.phone;
    if (!phone) return;

    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        utils.showError('拨打电话失败');
      }
    });
  },

  // 联系司机
  onContactDriver() {
    const phone = this.data.order.driverPhone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      });
    }
  },

  // 取消订单
  onCancelOrder() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            utils.showLoading('取消中...');
            const result = await api.cancelOrder(this.data.orderId);
            utils.hideLoading();

            if (result.code === 1000) {
              utils.showSuccess('订单已取消');
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            } else {
              utils.showError(result.message || '取消失败');
            }
          } catch (err) {
            utils.hideLoading();
            utils.showError('网络请求失败');
            console.error('取消订单失败:', err);
          }
        }
      }
    });
  },

  // 完成订单
  onCompleteOrder() {
    wx.showModal({
      title: '确认完成',
      content: '确定已完成行程吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            utils.showLoading('处理中...');
            const result = await api.completeOrder(this.data.orderId);
            utils.hideLoading();

            if (result.code === 1000) {
              utils.showSuccess('订单已完成');
              this.loadOrderDetail();
            } else {
              utils.showError(result.message || '操作失败');
            }
          } catch (err) {
            utils.hideLoading();
            utils.showError('网络请求失败');
            console.error('完成订单失败:', err);
          }
        }
      }
    });
  }
});
