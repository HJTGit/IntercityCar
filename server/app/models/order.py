from datetime import datetime
from app.extensions import db


class Order(db.Model):
    """订单模型"""
    __tablename__ = 'orders'

    # 主键
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)

    # 订单编号
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

    # 订单状态
    status = db.Column(db.String(20), default='pending')

    # 时间戳
    create_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    accept_time = db.Column(db.DateTime, nullable=True)
    complete_time = db.Column(db.DateTime, nullable=True)
    cancel_time = db.Column(db.DateTime, nullable=True)

    # 软删除标记
    deleted = db.Column(db.SmallInteger, default=0)

    def to_dict(self):
        """转换为字典"""
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
            'createTime': self.create_time.strftime('%Y-%m-%d %H:%M:%S') if self.create_time else None,
            'acceptTime': self.accept_time.strftime('%Y-%m-%d %H:%M:%S') if self.accept_time else None,
            'completeTime': self.complete_time.strftime('%Y-%m-%d %H:%M:%S') if self.complete_time else None,
            'cancelTime': self.cancel_time.strftime('%Y-%m-%d %H:%M:%S') if self.cancel_time else None,
        }
