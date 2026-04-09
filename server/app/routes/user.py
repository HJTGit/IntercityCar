from flask import Blueprint, request
from app.models.user import User
from app.services.user_service import UserService
from app.utils.response import success, error

user_bp = Blueprint('user', __name__)


@user_bp.route('/info', methods=['GET'])
def get_user_info():
    """获取用户信息"""
    openid = request.headers.get('X-OpenID', '')
    if not openid:
        return error('缺少用户标识', 400)

    user = UserService.get_user_by_openid(openid)
    if not user:
        return error('用户不存在', 404)

    return success(data=user.to_dict())


@user_bp.route('/register', methods=['POST'])
def register_user():
    """注册/更新用户信息"""
    openid = request.headers.get('X-OpenID', '')
    if not openid:
        return error('缺少用户标识', 400)

    data = request.get_json() or {}
    nickname = data.get('nickname', '')
    avatar = data.get('avatar', '')
    phone = data.get('phone', '')
    name = data.get('name', '')

    # 获取或创建用户
    user = UserService.get_or_create_user(openid, nickname, avatar)

    # 更新其他信息
    if phone or name:
        user = UserService.update_user(openid, phone=phone, name=name, nickname=nickname, avatar=avatar)

    return success(data=user.to_dict())


@user_bp.route('/update', methods=['POST'])
def update_user_info():
    """更新用户信息"""
    openid = request.headers.get('X-OpenID', '')
    if not openid:
        return error('缺少用户标识', 400)

    data = request.get_json() or {}
    user = UserService.update_user(openid, **data)

    if not user:
        return error('用户不存在', 404)

    return success(data=user.to_dict())


@user_bp.route('/list', methods=['GET'])
def get_all_users():
    """获取所有用户列表"""
    users = User.query.filter_by(status=1).all()
    return success(data=[u.to_dict() for u in users])


@user_bp.route('/role', methods=['POST'])
def update_role():
    """更新用户角色"""
    openid = request.headers.get('X-OpenID', '')
    if not openid:
        return error('缺少用户标识', 400)

    data = request.get_json() or {}
    role = data.get('role', '')

    if role not in ['passenger', 'driver']:
        return error('无效的角色', 400)

    # 确保用户存在
    UserService.get_or_create_user(openid)

    user = UserService.update_role(openid, role)
    if not user:
        return error('更新失败', 500)

    return success(data=user.to_dict())
