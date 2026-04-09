# 上门车接车送 - 微信小程序

> 乘客发起上门接送预约，司机抢单接载，实现"车接车送"的便捷出行服务

## 功能预览

### 乘客端
- 微信一键登录，自动获取用户信息
- 角色切换（乘客/司机）
- 下单预约：选择出发地、目的地、预约时间
- 订单管理：查看全部订单、订单详情、取消订单

### 司机端
- 查看所有待接单的预约订单
- 一键接单
- 完成行程确认

## 技术架构

| 层级 | 技术选型 | 说明 |
|-----|---------|------|
| 前端 | 微信小程序 + Vant Weapp | 原生框架 + 有赞UI组件 |
| 后端 | Python Flask + SQLAlchemy | RESTful API |
| 数据库 | MySQL | 关系型数据库 |
| 用户认证 | X-OpenID Header | 微信OpenID标识 |

## 项目结构

```
IntercityCar/
├── miniprogram/                 # 微信小程序前端
│   ├── pages/
│   │   ├── index/              # 首页（角色选择）
│   │   ├── passenger/
│   │   │   ├── create-order/    # 下单页
│   │   │   └── order-list/      # 订单列表
│   │   ├── driver/
│   │   │   ├── order-hall/      # 订单大厅
│   │   │   └── my-orders/        # 我的订单
│   │   └── order-detail/        # 订单详情
│   ├── components/             # 公共组件
│   ├── utils/                  # 工具函数
│   └── app.js                   # 小程序入口
├── server/                      # Flask 后端
│   ├── app/
│   │   ├── models/             # 数据模型
│   │   ├── routes/              # API 路由
│   │   ├── services/           # 业务逻辑
│   │   └── utils/               # 工具函数
│   ├── static/                  # 静态资源
│   └── run.py                   # 启动入口
└── docs/                        # 文档
```

## 快速开始

### 后端启动

```bash
cd server
pip install -r requirements.txt
python run.py
```

后端服务将在 http://localhost:5000 启动

### 小程序开发

1. 使用微信开发者工具导入 `miniprogram` 目录
2. 修改 `miniprogram/utils/config.js` 中的 `apiBase` 为后端地址
3. 编译运行

## API 接口

### 用户相关

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/api/user/info` | GET | 获取用户信息 |
| `/api/user/register` | POST | 注册/更新用户 |
| `/api/user/update` | POST | 更新用户信息 |
| `/api/user/role` | POST | 更新用户角色 |
| `/api/user/list` | GET | 获取所有用户列表 |

### 订单相关

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/api/order/create` | POST | 创建订单 |
| `/api/orders` | GET | 获取订单列表 |
| `/api/order/<id>` | GET | 获取订单详情 |
| `/api/order/<id>/accept` | POST | 司机接单 |
| `/api/order/<id>/complete` | POST | 完成订单 |
| `/api/order/<id>/cancel` | POST | 取消订单 |

## 订单状态流转

```
[乘客下单] → 待接单 → [司机接单] → 已接单 → [行程完成] → 已完成
                ↓
            [乘客取消] → 已取消
```

## 数据库表

### users 表

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | INT | 主键 |
| openid | VARCHAR(64) | 微信OpenID |
| nickname | VARCHAR(128) | 昵称 |
| avatar | VARCHAR(256) | 头像URL |
| phone | VARCHAR(32) | 手机号 |
| name | VARCHAR(64) | 姓名 |
| role | VARCHAR(32) | 角色 passenger/driver |
| status | INT | 状态 1=正常 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### orders 表

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | INT | 主键 |
| order_no | VARCHAR(64) | 订单编号 |
| passenger_id | VARCHAR(64) | 乘客OpenID |
| passenger_name | VARCHAR(64) | 乘客昵称 |
| passenger_phone | VARCHAR(32) | 乘客手机号 |
| driver_id | VARCHAR(64) | 司机OpenID |
| driver_name | VARCHAR(64) | 司机昵称 |
| driver_phone | VARCHAR(32) | 司机手机号 |
| start_location | JSON | 出发地信息 |
| end_location | JSON | 目的地信息 |
| appointment_time | DATETIME | 预约时间 |
| passenger_count | INT | 乘车人数 |
| remark | TEXT | 备注 |
| status | VARCHAR(32) | 订单状态 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

## 开发团队

- 产品设计
- 前端开发
- 后端开发

## 许可证

MIT License
