const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default');
const { hadNotAdminPermission, invalidToken } = require('../constant/err.type');
const { getUserModel } = require('../model/user.model');

/**
 * 验证令牌并附加完整用户信息的中间件
 * @param {object} ctx - Koa 上下文对象
 * @param {function} next - 调用下一个中间件的函数
 */
const auth = async (ctx, next) => {
  const { authorization = '' } = ctx.request.header;
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    console.error('未提供令牌');
    return ctx.app.emit('error', invalidToken, ctx);
  }

  try {
    // 1. 验证token并解析出id
    const decoded = jwt.verify(token, JWT_SECRET);

    // 2. 使用id查询完整的用户信息
    const User = await getUserModel();
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.error('令牌有效，但用户不存在', decoded.id);
      return ctx.app.emit('error', invalidToken, ctx);
    }

    // 3. 将完整的用户信息挂载到ctx.state.user
    ctx.state.user = user.dataValues;
    await next();
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err);
        return ctx.app.emit(
          'error',
          { ...invalidToken, message: 'token已过期' },
          ctx,
        );
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

module.exports = {
  auth,
  hadAdminPermission,
};
