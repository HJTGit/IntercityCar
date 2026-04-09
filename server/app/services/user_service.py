from datetime import datetime
from app.models.user import User
from app.extensions import db


class UserService:
    """用户服务"""

    @staticmethod
    def get_user_by_openid(openid):
        """根据openid获取用户"""
        return User.query.filter_by(openid=openid, status=1).first()

    @staticmethod
    def create_user(openid, nickname='', avatar='', phone='', name=''):
        """创建用户"""
        user = User(
            openid=openid,
            nickname=nickname,
            avatar=avatar,
            phone=phone,
            name=name,
            role='passenger'
        )
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def get_or_create_user(openid, nickname='', avatar=''):
        """获取或创建用户"""
        user = UserService.get_user_by_openid(openid)
        if not user:
            user = UserService.create_user(openid, nickname, avatar)
        return user

    @staticmethod
    def update_user(openid, **kwargs):
        """更新用户信息"""
        user = UserService.get_user_by_openid(openid)
        if not user:
            return None

        allowed_fields = ['nickname', 'avatar', 'phone', 'name', 'role']
        for field in allowed_fields:
            if field in kwargs:
                setattr(user, field, kwargs[field])

        user.update_time = datetime.now()
        db.session.commit()
        return user

    @staticmethod
    def update_role(openid, role):
        """更新用户角色"""
        user = UserService.get_user_by_openid(openid)
        if not user:
            return None

        if role not in ['passenger', 'driver']:
            return None

        user.role = role
        user.update_time = datetime.now()
        db.session.commit()
        return user
