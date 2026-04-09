from flask import jsonify


def success(message='success', data=None):
    """成功响应"""
    return jsonify({
        'code': 1000,
        'message': message,
        'data': data
    })


def error(message='error', code=1006, data=None):
    """错误响应"""
    return jsonify({
        'code': code,
        'message': message,
        'data': data
    }), 400
