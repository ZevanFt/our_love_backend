const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default');
const { hadNotAdminPermission, invalidToken } = require('../constant/err.type');

/**
 * 验证令牌的中间件
 * @param {object} ctx - Koa 上下文对象
 * @param {function} next - 调用下一个中间件的函数
 */
const verifyToken = async (ctx, next) => {
    const { authorization = '' } = ctx.request.header;
    const token = authorization.replace('Bearer ', '');

    if (!token) {
        console.error('未提供令牌');
        return ctx.app.emit('error', invalidToken, ctx);
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        ctx.state.user = user;
        await next();
    } catch (err) {
        switch (err.name) {
            case 'TokenExpiredError':
                console.error('token已过期', err);
                return ctx.app.emit('error', { ...invalidToken, message: 'token已过期' }, ctx);
            case 'JsonWebTokenError':
                console.error('无效的token', err);
                return ctx.app.emit('error', invalidToken, ctx);
            default:
                console.error('token验证发生未知错误', err);
                return ctx.app.emit('error', invalidToken, ctx);
        }
    }
};

/**
 * 检查是否为管理员的中间件
 * @param {object} ctx - Koa 上下文对象
 * @param {function} next - 调用下一个中间件的函数
 */
const hadAdminPermission = async (ctx, next) => {
    const { is_admin } = ctx.state.user;
    if (!is_admin) {
        console.error('该用户没有管理员权限', ctx.state.user);
        return ctx.app.emit('error', hadNotAdminPermission, ctx);
    }
    await next();
};

// 是否有权限发布商品等，需要有情侣才可以，所服务的项目为情侣app
const hadPermissionOnOff = async (ctx, next) => {
    const { is_admin } = ctx.state.user;
    if (!is_admin) {
        console.error('该用户没有管理员权限', ctx.state.user);
        return ctx.app.emit('error', hadNotAdminPermission, ctx);
    }
    await next();
};

module.exports = {
    verifyToken,
    hadAdminPermission,
};
