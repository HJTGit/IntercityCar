from functools import wraps
from flask import request, g
from app.utils.response import error


def login_required(f):
    """登录验证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        openid = request.headers.get('X-OpenID')
        if not openid:
            return error('未登录', code=1002)
        g.openid = openid
        return f(*args, **kwargs)
    return decorated_function
