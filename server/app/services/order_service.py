import random
from datetime import datetime
from app.extensions import db
from app.models.order import Order


class OrderService:
    """订单服务"""

    # 订单状态常量
    STATUS_PENDING = 'pending'
    STATUS_ACCEPTED = 'accepted'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'

    def generate_order_no(self):
        """生成唯一订单编号"""
        timestamp = datetime.now().strftime('%Y%m%d%H%m%S')
        random_str = str(random.randint(100000, 999999))
        return f'OR{timestamp}{random_str}'

    def create_order(self, data, openid):
        """创建订单"""
        order = Order(
            order_no=self.generate_order_no(),
            passenger_id=openid,
            passenger_name=data.get('passengerName', ''),
            passenger_phone=data.get('passengerPhone', ''),
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
            status=self.STATUS_PENDING
        )
        db.session.add(order)
        db.session.commit()
        return {'orderId': order.id, 'orderNo': order.order_no}

    def get_orders(self, openid, role, status=None, page=1, page_size=10):
        """获取订单列表"""
        query = Order.query.filter_by(deleted=0)

        # 根据角色筛选
        if role == 'passenger':
            query = query.filter_by(passenger_id=openid)
        elif role == 'driver':
            # 司机端筛选已接单和自己的订单
            query = query.filter(
                db.or_(
                    Order.driver_id == openid,
                    db.and_(
                        Order.driver_id.is_(None),
                        Order.status == self.STATUS_PENDING
                    )
                )
            )

        # 状态筛选
        if status:
            query = query.filter_by(status=status)

        # 按创建时间倒序
        query = query.order_by(Order.create_time.desc())

        # 分页
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

    def accept_order(self, order_id, openid, driver_name, driver_phone, driver_avatar=''):
        """司机接单"""
        order = self.get_order_by_id(order_id)
        if not order:
            return False, '订单不存在', 1003

        if order.status != self.STATUS_PENDING:
            return False, '订单已被接走或状态异常', 1004

        order.status = self.STATUS_ACCEPTED
        order.driver_id = openid
        order.driver_name = driver_name
        order.driver_phone = driver_phone
        order.driver_avatar = driver_avatar
        order.accept_time = datetime.now()
        db.session.commit()
        return True, '接单成功', 1000

    def complete_order(self, order_id, openid):
        """完成订单"""
        order = self.get_order_by_id(order_id)
        if not order:
            return False, '订单不存在', 1003

        if order.status != self.STATUS_ACCEPTED:
            return False, '订单状态异常', 1004

        if order.driver_id != openid:
            return False, '无权操作此订单', 1004

        order.status = self.STATUS_COMPLETED
        order.complete_time = datetime.now()
        db.session.commit()
        return True, '订单已完成', 1000

    def cancel_order(self, order_id, openid):
        """取消订单"""
        order = self.get_order_by_id(order_id)
        if not order:
            return False, '订单不存在', 1003

        if order.status != self.STATUS_PENDING:
            return False, '仅待接单状态可取消', 1004

        if order.passenger_id != openid:
            return False, '无权取消此订单', 1004

        order.status = self.STATUS_CANCELLED
        order.cancel_time = datetime.now()
        db.session.commit()
        return True, '订单已取消', 1000
