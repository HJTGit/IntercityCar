// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        icon: '🏠'
      },
      {
        pagePath: '/pages/passenger/order-list/order-list',
        text: '订单',
        icon: '📋'
      },
      {
        pagePath: '/pages/driver/order-hall/order-hall',
        text: '大厅',
        icon: '🏢'
      },
      {
        pagePath: '/pages/driver/my-orders/my-orders',
        text: '我的',
        icon: '👤'
      }
    ]
  },

  attached() {
    this.updateSelected();
  },

  methods: {
    updateSelected() {
      const pages = getCurrentPages();
      if (!pages || pages.length === 0) return;

      const currentPage = pages[pages.length - 1];
      const route = '/' + currentPage.route;

      let selected = 0;
      if (route.includes('passenger/order-list')) {
        selected = 1;
      } else if (route.includes('driver/order-hall')) {
        selected = 2;
      } else if (route.includes('driver/my-orders')) {
        selected = 3;
      }

      this.setData({ selected });
    },

    onTabChange(e) {
      const index = e.currentTarget.dataset.index;
      const pagePath = this.data.list[index].pagePath;

      wx.switchTab({ url: pagePath });

      this.setData({ selected: index });
    }
  }
});
