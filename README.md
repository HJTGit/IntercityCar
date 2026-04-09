# 上门车接车送 - 微信小程序

> 乘客发起上门接送预约，司机抢单接载，实现"车接车送"的便捷出行服务

## 功能预览

### 乘客端
- 微信一键登录，自动获取用户信息（昵称、头像、手机号）
- 角色切换（乘客/司机）
- 下单预约：选择出发地、目的地、预约时间、乘车人数、备注
- 订单管理：查看全部订单、订单详情、取消订单
- 订单详情页显示地图，标注起点和终点位置

### 司机端
- 订单大厅：查看所有待接单的预约订单
- 一键接单
- 我的接单：管理已接的订单
- 完成行程确认
- 订单详情页显示地图，标注起点和终点位置

## 技术架构

| 层级 | 技术选型 | 说明 |
|-----|---------|------|
| 前端 | 微信小程序 + Vant Weapp | 原生框架 + 有赞UI组件 |
| 后端 | Python Flask + SQLAlchemy | RESTful API |
| 数据库 | MySQL | 关系型数据库 |
| 用户认证 | X-OpenID Header | 微信OpenID标识 |
| 地图 | 微信小程序 map 组件 | 展示订单起终点 |

## 项目结构

```
IntercityCar/
├── miniprogram/                 # 微信小程序前端
│   ├── pages/
│   │   ├── index/              # 首页
│   │   ├── passenger/
│   │   │   ├── create-order/    # 下单页
│   │   │   └── order-list/      # 订单列表
│   │   ├── driver/
│   │   │   ├── order-hall/      # 订单大厅
│   │   │   └── my-orders/       # 我的接单
│   │   └── order-detail/        # 订单详情（带地图）
│   ├── components/              # 公共组件（自定义tabbar）
│   ├── utils/                   # 工具函数
│   └── app.js                   # 小程序入口
├── server/                      # Flask 后端
│   ├── app/
│   │   ├── models/             # 数据模型
│   │   ├── routes/              # API 路由
│   │   ├── services/           # 业务逻辑
│   │   └── utils/               # 工具函数
│   ├── static/                  # 静态资源（管理后台页面）
│   └── run.py                   # 启动入口
└── README.md                    # 项目文档
```

## 快速开始

### 1. 数据库准备

创建 MySQL 数据库：

```sql
CREATE DATABASE intercity_car DEFAULT CHARACTER SET utf8mb4;
```

### 2. 后端启动

```bash
cd server
pip install -r requirements.txt
python run.py
```

后端服务将在 http://localhost:5000 启动

### 3. 管理后台

访问 http://localhost:5000 进入 API 测试后台，可进行：
- 用户管理
- 创建订单测试
- 订单列表查看
- 订单详情查询

### 4. 小程序开发

1. 使用微信开发者工具导入 `miniprogram` 目录
2. 修改 `miniprogram/utils/config.js` 中的 `apiBase` 为后端地址
   - 模拟器调试：`http://127.0.0.1:5000/api`
   - 真机调试：需使用电脑局域网 IP，如 `http://192.168.x.x:5000/api`
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
| `/api/health` | GET | 健康检查 |

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
| id | BIGINT | 主键 |
| openid | VARCHAR(64) | 微信OpenID，唯一索引 |
| nickname | VARCHAR(64) | 昵称 |
| avatar | VARCHAR(255) | 头像URL |
| phone | VARCHAR(20) | 手机号 |
| name | VARCHAR(64) | 姓名 |
| role | VARCHAR(20) | 角色 passenger/driver |
| status | SMALLINT | 状态 1=正常 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### orders 表

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | BIGINT | 主键 |
| order_no | VARCHAR(32) | 订单编号，唯一 |
| passenger_id | VARCHAR(64) | 乘客OpenID |
| passenger_name | VARCHAR(64) | 乘客姓名 |
| passenger_phone | VARCHAR(20) | 乘客手机号 |
| passenger_avatar | VARCHAR(255) | 乘客头像 |
| driver_id | VARCHAR(64) | 司机OpenID |
| driver_name | VARCHAR(64) | 司机姓名 |
| driver_phone | VARCHAR(20) | 司机手机号 |
| driver_avatar | VARCHAR(255) | 司机头像 |
| start_location_name | VARCHAR(128) | 出发地名称 |
| start_location_address | VARCHAR(255) | 出发地地址 |
| start_location_lat | DECIMAL(10,6) | 出发地纬度 |
| start_location_lng | DECIMAL(10,6) | 出发地经度 |
| end_location_name | VARCHAR(128) | 目的地名称 |
| end_location_address | VARCHAR(255) | 目的地地址 |
| end_location_lat | DECIMAL(10,6) | 目的地纬度 |
| end_location_lng | DECIMAL(10,6) | 目的地经度 |
| appointment_time | DATETIME | 预约时间 |
| passenger_count | SMALLINT | 乘车人数 |
| remark | VARCHAR(255) | 备注 |
| status | VARCHAR(20) | 订单状态 |
| accept_time | DATETIME | 接单时间 |
| complete_time | DATETIME | 完成时间 |
| cancel_time | DATETIME | 取消时间 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |
| deleted | SMALLINT | 软删除标记 |

## 环境变量

后端支持以下环境变量配置：

| 变量名 | 说明 | 默认值 |
|-------|------|-------|
| MYSQL_HOST | MySQL 主机 | localhost |
| MYSQL_PORT | MySQL 端口 | 3306 |
| MYSQL_USER | MySQL 用户名 | root |
| MYSQL_PASSWORD | MySQL 密码 | |
| MYSQL_DB | 数据库名 | intercity_car |

## 许可证

MIT License
