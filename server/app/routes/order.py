from flask import Blueprint, request, g
from app.services.order_service import OrderService
from app.utils.response import success, error
from app.utils.decorators import login_required

order_bp = Blueprint('order', __name__)
order_service = OrderService()


@order_bp.route('/order/create', methods=['POST'])
@login_required
def create_order():
    """创建订单"""
    data = request.get_json()

    # 参数校验
    if not data:
        return error('请求参数不能为空', code=1001)

    required_fields = ['startLocation', 'endLocation', 'appointmentTime']
    for field in required_fields:
        if field not in data:
            return error(f'缺少必填参数: {field}', code=1001)

    if not data.get('passengerName'):
        return error('缺少乘客姓名', code=1001)

    if not data.get('passengerPhone'):
        return error('缺少乘客手机号', code=1001)

    result = order_service.create_order(data, g.openid)
    return success('订单创建成功', result)


@order_bp.route('/orders', methods=['GET'])
@login_required
def get_orders():
    """获取订单列表"""
    role = request.args.get('role', 'passenger')
    status = request.args.get('status')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('pageSize', 10))

    result = order_service.get_orders(g.openid, role, status, page, page_size)
    return success('success', result)


@order_bp.route('/order/<int:order_id>', methods=['GET'])
@login_required
def get_order_detail(order_id):
    """获取订单详情"""
    order = order_service.get_order_by_id(order_id)
    if not order:
        return error('订单不存在', code=1003)
    return success('success', order.to_dict())


@order_bp.route('/order/<int:order_id>/accept', methods=['POST'])
@login_required
def accept_order(order_id):
    """司机接单"""
    data = request.get_json() or {}

    result, msg, code = order_service.accept_order(
        order_id,
        g.openid,
        driver_name=data.get('driverName', '司机'),
        driver_phone=data.get('driverPhone', ''),
        driver_avatar=data.get('driverAvatar', '')
    )
    if result:
        return success(msg)
    return error(msg, code=code)


@order_bp.route('/order/<int:order_id>/complete', methods=['POST'])
@login_required
def complete_order(order_id):
    """完成订单"""
    result, msg, code = order_service.complete_order(order_id, g.openid)
    if result:
        return success(msg)
    return error(msg, code=code)


@order_bp.route('/order/<int:order_id>/cancel', methods=['POST'])
@login_required
def cancel_order(order_id):
    """取消订单"""
    result, msg, code = order_service.cancel_order(order_id, g.openid)
    if result:
        return success(msg)
    return error(msg, code=code)


@order_bp.route('/health', methods=['GET'])
def health_check():
    """健康检查"""
    return success('OK', {'status': 'healthy'})
