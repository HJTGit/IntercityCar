// pages/order-detail/order-detail.js
const api = require('../../utils/api.js');
const utils = require('../../utils/utils.js');
const constants = require('../../utils/constants.js');

Page({
  data: {
    orderId: null,
    role: 'passenger',
    order: {},
    mapCenter: {
      latitude: 39.908823,
      longitude: 116.397470
    },
    mapScale: 14,
    markers: []
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
        this.updateMapData(order);
      } else {
        utils.showError(res.message || '加载失败');
      }
    } catch (err) {
      utils.hideLoading();
      utils.showError('网络请求失败');
      console.error('加载订单详情失败:', err);
    }
  },

  // 更新地图数据
  updateMapData(order) {
    const markers = [];

    // 添加起点标记
    if (order.startLocation && order.startLocation.latitude && order.startLocation.longitude) {
      markers.push({
        id: 1,
        latitude: order.startLocation.latitude,
        longitude: order.startLocation.longitude,
        width: 30,
        height: 30,
        callout: {
          content: '起点: ' + order.startLocation.name,
          color: '#333333',
          fontSize: 12,
          borderRadius: 8,
          padding: 8,
          display: 'ALWAYS',
          bgColor: '#FFFFFF'
        }
      });
    }

    // 添加终点标记
    if (order.endLocation && order.endLocation.latitude && order.endLocation.longitude) {
      markers.push({
        id: 2,
        latitude: order.endLocation.latitude,
        longitude: order.endLocation.longitude,
        width: 30,
        height: 30,
        callout: {
          content: '终点: ' + order.endLocation.name,
          color: '#333333',
          fontSize: 12,
          borderRadius: 8,
          padding: 8,
          display: 'ALWAYS',
          bgColor: '#FFFFFF'
        }
      });
    }

    // 设置地图中心点
    let mapCenter = this.data.mapCenter;
    let mapScale = 14;

    if (markers.length > 0) {
      if (markers.length === 2) {
        // 两个点都在，取中点
        mapCenter = {
          latitude: (markers[0].latitude + markers[1].latitude) / 2,
          longitude: (markers[0].longitude + markers[1].longitude) / 2
        };

        // 计算两个点之间的距离，调整缩放级别
        const latDiff = Math.abs(markers[0].latitude - markers[1].latitude);
        const lngDiff = Math.abs(markers[0].longitude - markers[1].longitude);
        const maxDiff = Math.max(latDiff, lngDiff);

        // 根据距离调整缩放级别
        if (maxDiff > 10) {
          mapScale = 3;
        } else if (maxDiff > 5) {
          mapScale = 4;
        } else if (maxDiff > 2) {
          mapScale = 6;
        } else if (maxDiff > 1) {
          mapScale = 8;
        } else if (maxDiff > 0.5) {
          mapScale = 10;
        } else if (maxDiff > 0.2) {
          mapScale = 12;
        } else if (maxDiff > 0.1) {
          mapScale = 13;
        } else {
          mapScale = 14;
        }
      } else {
        mapCenter = {
          latitude: markers[0].latitude,
          longitude: markers[0].longitude
        };
        mapScale = 16;
      }
    }

    this.setData({ markers, mapCenter, mapScale });
  },

  // 点击地图标记
  onMarkerTap(e) {
    const markerId = e.detail.markerId;
    const order = this.data.order;

    if (markerId === 1 && order.startLocation) {
      this.openLocation(order.startLocation);
    } else if (markerId === 2 && order.endLocation) {
      this.openLocation(order.endLocation);
    }
  },

  // 在地图中打开位置
  openLocation(location) {
    if (!location || !location.latitude || !location.longitude) return;

    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name || '',
      address: location.address || location.name || '',
      scale: 18
    });
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
