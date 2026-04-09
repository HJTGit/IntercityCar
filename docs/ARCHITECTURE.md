# 上门车接车送 - 技术架构文档

---

## 一、技术选型

### 1.1 技术栈总览

| 层级 | 技术选型 | 版本 | 说明 |
|-----|---------|------|------|
| 前端框架 | 微信小程序原生框架 | - | 微信官方框架，稳定性高 |
| 开发语言 | JavaScript / WXSS | ES6+ | 小程序标准语言 |
| UI 组件库 | Vant Weapp | ^1.10.0 | 有赞出品，轻量级组件库 |
| 后端框架 | Python + Flask | 3.x | 轻量级 Web 框架，适合 RESTful API |
| 数据库 | MySQL | 8.0+ | 关系型数据库，稳定可靠 |
| ORM | SQLAlchemy | ^2.0 | Python ORM 框架 |
| API 风格 | RESTful | - | JSON 格式通信 |
| 用户标识 | 微信 OpenID | - | 用户身份唯一标识 |

### 1.2 选择理由

**为什么选择 Python + Flask？**
- Python 语法简洁，开发效率高
- Flask 轻量灵活，易于扩展
- 生态丰富，有完善的微信开发库
- 适合中小型项目快速上线
- 部署简单，支持多种部署方式

**为什么选择 MySQL？**
- 成熟稳定，广泛使用
- 事务支持完善，数据可靠性高
- 索引优化成熟，查询效率高
- 你已有 MySQL 服务器，可直接使用

**为什么选择 Vant Weapp？**
- 组件丰富，覆盖常见 UI 场景
- 轻量级，性能优秀
- 风格简洁，适合工具类应用
- 社区活跃，文档完善

---

## 二、项目结构

### 2.1 目录结构

```
IntercityCar/
│
├── server/                          # Python 后端目录
│   ├── app/                        # 应用主目录
│   │   ├── __init__.py             # Flask 应用工厂
│   │   ├── config.py               # 配置文件
│   │   ├── models/                 # 数据模型
│   │   │   ├── __init__.py
│   │   │   ├── order.py            # 订单模型
│   │   │   └── user.py            # 用户模型
│   │   ├── routes/                # 路由目录
│   │   │   ├── __init__.py
│   │   │   ├── order.py           # 订单相关路由
│   │   │   └── user.py            # 用户相关路由
│   │   ├── services/              # 业务逻辑
│   │   │   ├── __init__.py
│   │   │   └── order_service.py   # 订单服务
│   │   └── utils/                  # 工具函数
│   │       ├── __init__.py
│   │       ├── response.py        # 响应封装
│   │       └── decorators.py      # 装饰器
│   ├── requirements.txt            # Python 依赖
│   ├── run.py                      # 启动入口
│   └── README.md                   # 后端说明
│
├── miniprogram/                    # 小程序前端目录
│   ├── pages/                      # 页面目录
│   │   ├── index/                  # 首页（角色选择）
│   │   │   ├── index.wxml
│   │   │   ├── index.js
│   │   │   ├── index.json
│   │   │   └── index.wxss
│   │   │
│   │   ├── passenger/              # 乘客端页面
│   │   │   ├── create-order/        # 下单页面
│   │   │   │   ├── create-order.wxml
│   │   │   │   ├── create-order.js
│   │   │   │   ├── create-order.json
│   │   │   │   └── create-order.wxss
│   │   │   └── order-list/          # 订单列表
│   │   │       ├── order-list.wxml
│   │   │       ├── order-list.js
│   │   │       ├── order-list.json
│   │   │       └── order-list.wxss
│   │   │
│   │   ├── driver/                  # 司机端页面
│   │   │   ├── order-hall/          # 订单大厅
│   │   │   │   ├── order-hall.wxml
│   │   │   │   ├── order-hall.js
│   │   │   │   ├── order-hall.json
│   │   │   │   └── order-hall.wxss
│   │   │   └── my-orders/           # 我的订单
│   │   │       ├── my-orders.wxml
│   │   │       ├── my-orders.js
│   │   │       ├── my-orders.json
│   │   │       └── my-orders.wxss
│   │   │
│   │   └── order-detail/            # 订单详情（共享）
│   │       ├── order-detail.wxml
│   │       ├── order-detail.js
│   │       ├── order-detail.json
│   │       └── order-detail.wxss
│   │
│   ├── components/                  # 公共组件
│   │   ├── order-card/              # 订单卡片组件
│   │   │   ├── order-card.wxml
│   │   │   ├── order-card.js
│   │   │   ├── order-card.json
│   │   │   └── order-card.wxss
│   │   └── location-picker/          # 位置选择器组件
│   │       ├── location-picker.wxml
│   │       ├── location-picker.js
│   │       ├── location-picker.json
│   │       └── location-picker.wxss
│   │
│   ├── utils/                       # 工具函数
│   │   ├── api.js                   # API 请求封装
│   │   ├── auth.js                  # 登录认证
│   │   ├── request.js               # 请求工具
│   │   ├── date.js                  # 日期格式化
│   │   ├── constants.js             # 常量定义
│   │   └── config.js                # 配置信息
│   │
│   ├── app.js                       # 小程序入口
│   ├── app.json                     # 全局配置
│   ├── app.wxss                     # 全局样式
│   └── sitemap.json                 # SEO 配置
│
├── docs/                           # 文档目录
│   ├── PRD.md                       # 产品需求文档
│   ├── ARCHITECTURE.md              # 本文档
│   └── FIGMA-PROTOTYPE.md           # Figma原型指南
│
├── .gitignore                       # Git 忽略文件
├── project.config.json               # 小程序项目配置
└── README.md                        # 项目说明
```

### 2.2 命名规范

| 类型 | 规范 | 示例 |
|-----|------|------|
| Python 文件 | 小写下划线 | order_service.py |
| Python 类 | 大驼峰 | OrderService |
| Python 函数 | 小写下划线 | get_order_by_id |
| 页面文件 | 小写下划线 | order_list.js |
| 组件 | 小写下划线 | order_card |
| 数据库表 | 小写下划线 | orders |
| API 路径 | 小写斜杠分隔 | /api/orders/create |

---

## 三、数据库设计

### 3.1 MySQL 表结构

#### 3.1.1 orders（订单表）

```sql
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单编号',
  `passenger_id` VARCHAR(64) NOT NULL COMMENT '乘客OpenID',
  `passenger_name` VARCHAR(64) NOT NULL COMMENT '乘客昵称',
  `passenger_phone` VARCHAR(20) NOT NULL COMMENT '乘客手机号',
  `passenger_avatar` VARCHAR(255) DEFAULT '' COMMENT '乘客头像',
  `driver_id` VARCHAR(64) DEFAULT NULL COMMENT '司机OpenID',
  `driver_name` VARCHAR(64) DEFAULT NULL COMMENT '司机昵称',
  `driver_phone` VARCHAR(20) DEFAULT NULL COMMENT '司机手机号',
  `driver_avatar` VARCHAR(255) DEFAULT NULL COMMENT '司机头像',
  `start_location_name` VARCHAR(128) NOT NULL COMMENT '出发地名称',
  `start_location_address` VARCHAR(255) DEFAULT '' COMMENT '出发地地址',
  `start_location_lat` DECIMAL(10,6) NOT NULL COMMENT '出发地纬度',
  `start_location_lng` DECIMAL(10,6) NOT NULL COMMENT '出发地经度',
  `end_location_name` VARCHAR(128) NOT NULL COMMENT '目的地名称',
  `end_location_address` VARCHAR(255) DEFAULT '' COMMENT '目的地地址',
  `end_location_lat` DECIMAL(10,6) NOT NULL COMMENT '目的地纬度',
  `end_location_lng` DECIMAL(10,6) NOT NULL COMMENT '目的地经度',
  `appointment_time` DATETIME NOT NULL COMMENT '预约时间',
  `passenger_count` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '乘车人数',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '备注',
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '订单状态',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `accept_time` DATETIME DEFAULT NULL COMMENT '接单时间',
  `complete_time` DATETIME DEFAULT NULL COMMENT '完成时间',
  `cancel_time` DATETIME DEFAULT NULL COMMENT '取消时间',
  `deleted` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_passenger` (`passenger_id`, `status`),
  KEY `idx_driver` (`driver_id`, `status`),
  KEY `idx_status_time` (`status`, `appointment_time`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';
```

#### 3.1.2 订单状态枚举

| 状态值 | 说明 |
|-------|------|
| pending | 待接单 |
| accepted | 已接单 |
| completed | 已完成 |
| cancelled | 已取消 |

---

## 四、后端 API 设计

### 4.1 API 基础信息

| 项目 | 值 |
|-----|---|
| 基础 URL | `https://your-domain.com/api` |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 认证方式 | Header: `X-OpenID` |

### 4.2 响应格式

```json
// 成功响应
{
  "code": 1000,
  "message": "success",
  "data": {}
}

// 失败响应
{
  "code": 1001,
  "message": "参数错误",
  "data": null
}
```

### 4.3 状态码定义

| 状态码 | 说明 |
|-------|------|
| 1000 | 成功 |
| 1001 | 参数错误 |
| 1002 | 未登录 |
| 1003 | 订单不存在 |
| 1004 | 订单状态错误 |
| 1005 | 订单已被接走 |
| 1006 | 系统错误 |

### 4.4 API 接口列表

| 方法 | 路径 | 功能 | 调用方 |
|-----|------|------|-------|
| POST | /api/order/create | 创建订单 | 乘客端 |
| GET | /api/orders | 获取订单列表 | 乘客端/司机端 |
| GET | /api/order/{id} | 获取订单详情 | 乘客端/司机端 |
| POST | /api/order/{id}/accept | 司机接单 | 司机端 |
| POST | /api/order/{id}/complete | 完成订单 | 司机端 |
| POST | /api/order/{id}/cancel | 取消订单 | 乘客端 |

### 4.5 接口详细设计

#### 4.5.1 创建订单

**请求：**
```
POST /api/order/create
Content-Type: application/json
X-OpenID: {openid}
```

```json
{
  "startLocation": {
    "name": "北京站",
    "address": "北京市东城区北京站",
    "latitude": 39.904,
    "longitude": 116.408
  },
  "endLocation": {
    "name": "上海虹桥站",
    "address": "上海市闵行区申贵路",
    "latitude": 31.194,
    "longitude": 121.320
  },
  "appointmentTime": "2024-03-15 14:00:00",
  "passengerCount": 1,
  "remark": "有大件行李"
}
```

**响应：**
```json
{
  "code": 1000,
  "message": "订单创建成功",
  "data": {
    "orderId": 1,
    "orderNo": "OR2024031514000001"
  }
}
```

#### 4.5.2 获取订单列表

**请求：**
```
GET /api/orders?role=passenger&status=pending&page=1&pageSize=10
X-OpenID: {openid}
```

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| role | string | 是 | passenger/driver |
| status | string | 否 | 筛选状态 |
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页条数，默认10 |

**响应：**
```json
{
  "code": 1000,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "orderNo": "OR2024031514000001",
        "startLocation": { "name": "北京站", ... },
        "endLocation": { "name": "上海虹桥站", ... },
        "appointmentTime": "2024-03-15 14:00:00",
        "status": "pending",
        ...
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 4.5.3 司机接单

**请求：**
```
POST /api/order/1/accept
X-OpenID: {openid}
```

**响应：**
```json
{
  "code": 1000,
  "message": "接单成功"
}
```

#### 4.5.4 完成订单

**请求：**
```
POST /api/order/1/complete
X-OpenID: {openid}
```

**响应：**
```json
{
  "code": 1000,
  "message": "订单已完成"
}
```

#### 4.5.5 取消订单

**请求：**
```
POST /api/order/1/cancel
X-OpenID: {openid}
```

**响应：**
```json
{
  "code": 1000,
  "message": "订单已取消"
}
```

---

## 五、后端核心代码

### 5.1 应用入口 (run.py)

```python
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### 5.2 Flask 应用工厂 (app/__init__.py)

```python
from flask import Flask
from app.config import config
from app.extensions import db
from app.routes import register_routes


def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # 初始化扩展
    db.init_app(app)

    # 注册路由
    register_routes(app)

    # 创建表
    with app.app_context():
        db.create_all()

    return app
```

### 5.3 订单模型 (app/models/order.py)

```python
from datetime import datetime
from app.extensions import db


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    order_no = db.Column(db.String(32), unique=True, nullable=False)

    # 乘客信息
    passenger_id = db.Column(db.String(64), nullable=False)
    passenger_name = db.Column(db.String(64), nullable=False)
    passenger_phone = db.Column(db.String(20), nullable=False)
    passenger_avatar = db.Column(db.String(255), default='')

    # 司机信息
    driver_id = db.Column(db.String(64), nullable=True)
    driver_name = db.Column(db.String(64), nullable=True)
    driver_phone = db.Column(db.String(20), nullable=True)
    driver_avatar = db.Column(db.String(255), nullable=True)

    # 出发地
    start_location_name = db.Column(db.String(128), nullable=False)
    start_location_address = db.Column(db.String(255), default='')
    start_location_lat = db.Column(db.Numeric(10, 6), nullable=False)
    start_location_lng = db.Column(db.Numeric(10, 6), nullable=False)

    # 目的地
    end_location_name = db.Column(db.String(128), nullable=False)
    end_location_address = db.Column(db.String(255), default='')
    end_location_lat = db.Column(db.Numeric(10, 6), nullable=False)
    end_location_lng = db.Column(db.Numeric(10, 6), nullable=False)

    # 预约信息
    appointment_time = db.Column(db.DateTime, nullable=False)
    passenger_count = db.Column(db.SmallInteger, default=1)
    remark = db.Column(db.String(255), default='')

    # 状态
    status = db.Column(db.String(20), default='pending')

    # 时间戳
    create_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    accept_time = db.Column(db.DateTime, nullable=True)
    complete_time = db.Column(db.DateTime, nullable=True)
    cancel_time = db.Column(db.DateTime, nullable=True)

    deleted = db.Column(db.SmallInteger, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'orderNo': self.order_no,
            'passengerId': self.passenger_id,
            'passengerName': self.passenger_name,
            'passengerPhone': self.passenger_phone,
            'passengerAvatar': self.passenger_avatar,
            'driverId': self.driver_id,
            'driverName': self.driver_name,
            'driverPhone': self.driver_phone,
            'driverAvatar': self.driver_avatar,
            'startLocation': {
                'name': self.start_location_name,
                'address': self.start_location_address,
                'latitude': float(self.start_location_lat),
                'longitude': float(self.start_location_lng)
            },
            'endLocation': {
                'name': self.end_location_name,
                'address': self.end_location_address,
                'latitude': float(self.end_location_lat),
                'longitude': float(self.end_location_lng)
            },
            'appointmentTime': self.appointment_time.strftime('%Y-%m-%d %H:%M:%S'),
            'passengerCount': self.passenger_count,
            'remark': self.remark,
            'status': self.status,
            'createTime': self.create_time.strftime('%Y-%m-%d %H:%M:%S'),
        }
```

### 5.4 订单路由 (app/routes/order.py)

```python
from flask import Blueprint, request
from app.services.order_service import OrderService
from app.utils.response import success, error
from app.utils.decorators import login_required

order_bp = Blueprint('order', __name__)
order_service = OrderService()


@order_bp.route('/order/create', methods=['POST'])
@login_required
def create_order():
    data = request.get_json()
    result = order_service.create_order(data)
    if result:
        return success('订单创建成功', result)
    return error('创建失败')


@order_bp.route('/orders', methods=['GET'])
@login_required
def get_orders():
    role = request.args.get('role')
    status = request.args.get('status')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))

    result = order_service.get_orders(role, status, page, page_size)
    return success('success', result)


@order_bp.route('/order/<int:order_id>', methods=['GET'])
@login_required
def get_order_detail(order_id):
    order = order_service.get_order_by_id(order_id)
    if not order:
        return error('订单不存在', code=1003)
    return success('success', order.to_dict())


@order_bp.route('/order/<int:order_id>/accept', methods=['POST'])
@login_required
def accept_order(order_id):
    result, msg = order_service.accept_order(order_id)
    if result:
        return success(msg)
    return error(msg, code=1004)


@order_bp.route('/order/<int:order_id>/complete', methods=['POST'])
@login_required
def complete_order(order_id):
    result, msg = order_service.complete_order(order_id)
    if result:
        return success(msg)
    return error(msg)


@order_bp.route('/order/<int:order_id>/cancel', methods=['POST'])
@login_required
def cancel_order(order_id):
    result, msg = order_service.cancel_order(order_id)
    if result:
        return success(msg)
    return error(msg)
```

### 5.5 订单服务 (app/services/order_service.py)

```python
from datetime import datetime
from app.extensions import db
from app.models.order import Order


class OrderService:
    ORDER_STATUS = {
        'PENDING': 'pending',
        'ACCEPTED': 'accepted',
        'COMPLETED': 'completed',
        'CANCELLED': 'cancelled'
    }

    def generate_order_no(self):
        """生成订单编号"""
        import random
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        random_str = str(random.randint(100000, 999999))
        return f'OR{timestamp}{random_str}'

    def create_order(self, data):
        """创建订单"""
        order = Order(
            order_no=self.generate_order_no(),
            passenger_id=data['passengerId'],
            passenger_name=data['passengerName'],
            passenger_phone=data['passengerPhone'],
            passenger_avatar=data.get('passengerAvatar', ''),
            start_location_name=data['startLocation']['name'],
            start_location_address=data['startLocation'].get('address', ''),
            start_location_lat=data['startLocation']['latitude'],
            start_location_lng=data['startLocation']['longitude'],
            end_location_name=data['endLocation']['name'],
            end_location_address=data['endLocation'].get('address', ''),
            end_location_lat=data['endLocation']['latitude'],
            end_location_lng=data['endLocation']['longitude'],
            appointment_time=datetime.strptime(data['appointmentTime'], '%Y-%m-%d %H:%M:%S'),
            passenger_count=data.get('passengerCount', 1),
            remark=data.get('remark', ''),
            status=self.ORDER_STATUS['PENDING']
        )
        db.session.add(order)
        db.session.commit()
        return {'orderId': order.id, 'orderNo': order.order_no}

    def get_orders(self, role, status, page, page_size):
        """获取订单列表"""
        query = Order.query.filter_by(deleted=0)

        if role == 'passenger':
            query = query.filter_by(passenger_id=role)
        elif role == 'driver':
            query = query.filter_by(driver_id=role)

        if status:
            query = query.filter_by(status=status)

        query = query.order_by(Order.create_time.desc())
        total = query.count()
        orders = query.offset((page - 1) * page_size).limit(page_size).all()

        return {
            'list': [o.to_dict() for o in orders],
            'total': total,
            'page': page,
            'pageSize': page_size
        }

    def get_order_by_id(self, order_id):
        """获取订单详情"""
        return Order.query.filter_by(id=order_id, deleted=0).first()

    def accept_order(self, order_id):
        """司机接单"""
        order = self.get_order_by_id(order_id)
        if not order:
            return False, '订单不存在'

        if order.status != self.ORDER_STATUS['PENDING']:
            return False, '订单已被接走或状态异常'

        order.status = self.ORDER_STATUS['ACCEPTED']
        order.accept_time = datetime.now()
        db.session.commit()
        return True, '接单成功'

    def complete_order(self, order_id):
        """完成订单"""
        order = self.get_order_by_id(order_id)
        if not order:
            return False, '订单不存在'

        if order.status != self.ORDER_STATUS['ACCEPTED']:
            return False, '订单状态异常'

        order.status = self.ORDER_STATUS['COMPLETED']
        order.complete_time = datetime.now()
        db.session.commit()
        return True, '订单已完成'

    def cancel_order(self, order_id):
        """取消订单"""
        order = self.get_order_by_id(order_id)
        if not order:
            return False, '订单不存在'

        if order.status != self.ORDER_STATUS['PENDING']:
            return False, '仅待接单状态可取消'

        order.status = self.ORDER_STATUS['CANCELLED']
        order.cancel_time = datetime.now()
        db.session.commit()
        return True, '订单已取消'
```

### 5.6 响应封装 (app/utils/response.py)

```python
from flask import jsonify


def success(message='success', data=None):
    return jsonify({
        'code': 1000,
        'message': message,
        'data': data
    })


def error(message='error', code=1006, data=None):
    return jsonify({
        'code': code,
        'message': message,
        'data': data
    }), 400
```

### 5.7 登录装饰器 (app/utils/decorators.py)

```python
from functools import wraps
from flask import request, g
from app.utils.response import error


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        openid = request.headers.get('X-OpenID')
        if not openid:
            return error('未登录', code=1002)
        g.openid = openid
        return f(*args, **kwargs)
    return decorated_function
```

---

## 六、前端架构

### 6.1 全局配置 (app.json)

```json
{
  "pages": [
    "pages/index/index",
    "pages/passenger/create-order/create-order",
    "pages/passenger/order-list/order-list",
    "pages/driver/order-hall/order-hall",
    "pages/driver/my-orders/my-orders",
    "pages/order-detail/order-detail"
  ],
  "window": {
    "navigationBarTitleText": "上门车接车送",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#f5f5f5"
  },
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#1890ff",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "text": "首页",
        "pagePath": "pages/index/index",
        "iconPath": "assets/icons/home.png",
        "selectedIconPath": "assets/icons/home-active.png"
      },
      {
        "text": "订单",
        "pagePath": "pages/passenger/order-list/order-list",
        "iconPath": "assets/icons/order.png",
        "selectedIconPath": "assets/icons/order-active.png"
      }
    ]
  },
  "usingComponents": {
    "van-button": "@vant/weapp/button/index",
    "van-field": "@vant/weapp/field/index",
    "van-picker": "@vant/weapp/picker/index",
    "van-popup": "@vant/weapp/popup/index",
    "van-dialog": "@vant/weapp/dialog/index",
    "van-toast": "@vant/weapp/toast/index",
    "van-icon": "@vant/weapp/icon/index",
    "van-tag": "@vant/weapp/tag/index",
    "van-card": "@vant/weapp/card/index"
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于叫车定位"
    }
  }
}
```

### 6.2 API 配置 (utils/config.js)

```javascript
module.exports = {
  // TODO: 修改为你的服务器地址
  API_BASE_URL: 'https://your-domain.com/api',

  // 小程序 AppID
  APP_ID: 'your-appid',

  // 常量
  ORDER_STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  STATUS_TEXT: {
    pending: '待接单',
    accepted: '已接单',
    completed: '已完成',
    cancelled: '已取消'
  }
};
```

### 6.3 API 请求封装 (utils/api.js)

```javascript
const config = require('./config');

function request(url, method, data) {
  const openid = wx.getStorageSync('openid') || '';

  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '加载中...' });

    wx.request({
      url: config.API_BASE_URL + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'X-OpenID': openid
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code === 1000) {
          resolve(res.data.data);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          });
          reject(res.data);
        }
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

// API 方法
const api = {
  // 创建订单
  createOrder: (data) => request('/order/create', 'POST', data),

  // 获取订单列表
  getOrders: (params) => request('/orders', 'GET', params),

  // 获取订单详情
  getOrderDetail: (id) => request(`/order/${id}`, 'GET'),

  // 司机接单
  acceptOrder: (id) => request(`/order/${id}/accept`, 'POST'),

  // 完成订单
  completeOrder: (id) => request(`/order/${id}/complete`, 'POST'),

  // 取消订单
  cancelOrder: (id) => request(`/order/${id}/cancel`, 'POST'),
};

module.exports = api;
```

---

## 七、部署架构

### 7.1 系统架构

```
┌─────────────────┐
│   微信小程序    │
│  (前端渲染)     │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Python/Flask  │  ◀─── 你的服务器
│   REST API      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     MySQL      │  ◀─── 你的数据库
│    数据库       │
└─────────────────┘
```

### 7.2 服务器要求

| 项目 | 最低配置 | 推荐配置 |
|-----|---------|---------|
| CPU | 1核 | 2核+ |
| 内存 | 1GB | 2GB+ |
| 带宽 | 1Mbps | 5Mbps+ |
| 系统 | Linux | Ubuntu/CentOS |
| Python | 3.8+ | 3.10+ |
| MySQL | 5.7+ | 8.0+ |

### 7.3 部署步骤

1. **安装 Python 依赖**
```bash
cd server
pip install -r requirements.txt
```

2. **配置数据库连接**
```python
# app/config.py
MYSQL_HOST = 'your-mysql-host'
MYSQL_PORT = 3306
MYSQL_USER = 'your-user'
MYSQL_PASSWORD = 'your-password'
MYSQL_DB = 'intercity_car'
```

3. **启动服务**
```bash
python run.py
```

4. **Nginx 反向代理（生产环境）**
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 7.4 安全建议

1. **HTTPS：** 必须在微信小程序后台配置 HTTPS 域名
2. **数据库密码：** 使用环境变量，不要明文写在代码里
3. **OpenID：** 不要在接口返回中暴露用户敏感信息
4. **限流：** 生产环境建议添加接口限流防护

---

## 八、扩展规划

### 8.1 短期扩展（v1.1）

- [ ] 地图路线规划（显示预计距离和时间）
- [ ] 消息通知（司机接单/取消时通知乘客）
- [ ] 订单评价功能

### 8.2 中期扩展（v2.0）

- [ ] 微信支付集成
- [ ] 司机入驻审核
- [ ] 行程保险

### 8.3 长期扩展（v3.0）

- [ ] 实时位置共享
- [ ] 拼车功能
- [ ] 城际大巴预约
