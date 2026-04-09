import os
from flask import Flask, send_from_directory
from app.config import Config
from app.extensions import db
from app.routes import register_routes


def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(Config)

    # 初始化扩展
    db.init_app(app)

    # 注册路由
    register_routes(app)

    # 静态文件服务
    static_folder = os.path.join(os.path.dirname(__file__), '..', 'static')
    @app.route('/')
    def index():
        return send_from_directory(static_folder, 'index.html')

    # 创建表
    with app.app_context():
        db.create_all()

    return app
