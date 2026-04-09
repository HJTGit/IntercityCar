from datetime import datetime
from app.extensions import db


class User(db.Model):
    """用户模型"""
    __tablename__ = 'users'

    # 主键
    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)

    # OpenID（微信唯一标识）
    openid = db.Column(db.String(64), unique=True, nullable=False, index=True)

    # 用户信息
    nickname = db.Column(db.String(64), default='')
    avatar = db.Column(db.String(255), default='')
    phone = db.Column(db.String(20), default='')
    name = db.Column(db.String(64), default='')

    # 角色：passenger 乘客, driver 司机
    role = db.Column(db.String(20), default='passenger')

    # 状态
    status = db.Column(db.SmallInteger, default=1)

    # 时间戳
    create_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'openid': self.openid,
            'nickname': self.nickname,
            'avatar': self.avatar,
            'phone': self.phone,
            'name': self.name,
            'role': self.role,
            'status': self.status,
            'createTime': self.create_time.strftime('%Y-%m-%d %H:%M:%S') if self.create_time else None,
            'updateTime': self.update_time.strftime('%Y-%m-%d %H:%M:%S') if self.update_time else None,
        }
