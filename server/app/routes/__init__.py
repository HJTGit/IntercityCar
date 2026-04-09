from app.routes.order import order_bp
from app.routes.user import user_bp


def register_routes(app):
    """注册所有路由"""
    app.register_blueprint(order_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api/user')
