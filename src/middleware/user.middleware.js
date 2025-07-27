// 引入 bcryptjs 库，用于密码加密和验证
const bcrypt = require('bcryptjs')
// 引入访问中间件工具函数，可能用于记录中间件访问日志
const { accessMiddleware } = require('../utils/console.utils')
// 引入从服务层获取用户信息的函数
const { getUser, isTokenBlacklisted } = require('../service/user.service')

/**
 * 用户请求数据合法性校验中间件
 * 校验请求体中的账号、密码和昵称是否存在
 * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
 * @param {function} next - 调用下一个中间件的函数
 */
const userValidator = async (ctx, next) => {
    accessMiddleware('userValidator')
    // 从请求体中解构出账号、密码和昵称
    const { yier_number, password } = ctx.request.body
    // 检查账号、密码和昵称是否为空
    if (!yier_number || !password) {
        // 若有空值，设置响应体，提示用户账号、密码、昵称不能为空
        ctx.body = {
            code: 400,
            msg: '账号、密码不能为空'
        }
        // 注释提示此处最好做统一异常处理并输出错误日志
        // ctx.app.emit('error', userFormatError, ctx)
        return
    }
    // 若校验通过，调用下一个中间件
    await next()
}

/**
 * 用户合理性校验中间件
 * 检查请求体中的用户名是否已存在于数据库中
 * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
 * @param {function} next - 调用下一个中间件的函数
 */
const verifyUser = async (ctx, next) => {
    accessMiddleware('verifyUser')
    // 从请求体中解构出用户名
    const { yier_number } = ctx.request.body
    try {
        // 调用服务层函数，根据用户名获取用户信息
        const res = await getUser({ yier_number })
        // 如果查询到用户信息，说明用户已存在
        if (res) {
            // 打印错误信息，包含已存在的用户名
            console.error('用户已经存在', { yier_number })
            // 触发错误事件，通知应用程序用户已存在
            // ctx.app.emit('error', userAlreadyExited, ctx)
            return
        }
    } catch (err) {
        // 若获取用户信息过程中出错，打印错误信息
        console.log('——获取用户信息错误——', err)
        // 触发错误事件，通知应用程序用户注册出错
        // ctx.app.emit('error', userRegisterError, ctx)
        return
    }
    // 若用户不存在且未出错，调用下一个中间件
    await next()
}

/**
 * 密码加密中间件
 * 对请求体中的密码进行加密处理
 * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
 * @param {function} next - 调用下一个中间件的函数
 */
const encryptPassword = async (ctx, next) => {
    accessMiddleware('encryptPassword')
    // 从请求体中解构出密码
    const { password } = ctx.request.body
    try {
        // 调用 bcryptjs 库的 hash 方法，对密码进行加密，第二个参数 10 为加密强度
        const encryptedPassword = await bcrypt.hash(password, 10)
        // 将加密后的密码替换原始密码
        ctx.request.body.password = encryptedPassword
    } catch (err) {
        // 若加密过程中出错，打印错误信息
        console.log('——密码加密错误——', err)
    }
    // 调用下一个中间件
    await next()
}

/**
 * 密码校验中间件
 * 验证请求体中的密码与存储的加密密码是否一致
 * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
 * @param {function} next - 调用下一个中间件的函数
 */
const verifyPassword = async (ctx, next) => {
    accessMiddleware('verifyPassword')
    // 从请求体中解构出密码和账号
    const { password, yier_number } = ctx.request.body;
    try {
        // 调用服务层函数，根据账号获取用户信息
        const res = await getUser({ yier_number });
        if (res) {
            // 获取存储的加密密码
            const encryptedPassword = res.password;
            // 调用 bcryptjs 库的 compare 方法，验证密码是否匹配
            const verified = await bcrypt.compare(password, encryptedPassword);
            // 如果校验失败，说明密码错误
            if (!verified) {
                // 打印错误信息，包含校验失败的密码
                console.error('密码校验失败', { password });
                // 触发错误事件，通知应用程序密码错误
                // ctx.app.emit('error', passwordError, ctx);
                return;
            }
        } else {
            // 若用户不存在，打印错误信息
            console.error('用户不存在', { yier_number });
            // 触发错误事件，通知应用程序用户不存在
            // ctx.app.emit('error', userNotFound, ctx);
            return;
        }
    } catch (err) {
        // 若校验过程中出错，打印错误信息
        console.log('——密码校验错误——', err);
        // 触发错误事件，通知应用程序密码校验出错
        // ctx.app.emit('error', passwordVerifyError, ctx);
        return;
    }
    // 若校验通过，调用下一个中间件
    await next();
}

/**
 * 验证登录中间件
 * 验证用户登录时的账号和密码是否正确
 * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
 * @param {function} next - 调用下一个中间件的函数
 */
const verifyLogin = async (ctx, next) => {
    accessMiddleware('verifyLogin')
    // 从请求体中解构出账号和密码
    const { yier_number, password } = ctx.request.body
    try {
        // 调用服务层函数，根据账号获取用户信息
        const res = await getUser({ yier_number })
        // 如果查询到用户信息，说明用户存在
        if (res) {
            // 调用 bcryptjs 库的 compare 方法，校验密码是否匹配
            const verified = await bcrypt.compare(password, res.password)
            // 如果校验失败，说明密码错误
            if (!verified) {
                // 打印错误信息，包含校验失败的密码
                console.error('密码校验失败', { password })
                return
            }
            // 若校验通过，调用下一个中间件
            await next()
            return
        }
        // 若用户不存在，打印错误信息
        console.error('用户不存在', { yier_number })
    } catch (err) {
        // 若获取用户信息过程中出错，打印错误信息
        console.log('——登录校验错误——', err)
    }
}

/**
 * 验证链接情侣关系请求的中间件
 * 检查请求体中是否包含目标用户 ID
 * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
 * @param {function} next - 调用下一个中间件的函数
 */
const verifyCoupleRequest = async (ctx, next) => {
    accessMiddleware('verifyCoupleRequest');
    const { targetUserId } = ctx.request.body;
    if (!targetUserId) {
        ctx.body = {
            code: 400,
            msg: '缺少建立情侣关系的用户ID'
        };
        return;
    }
    await next();
};

//  暴露中间件函数，供其他模块使用
module.exports = {
    userValidator,
    verifyUser,
    encryptPassword,
    verifyPassword,
    verifyLogin,
    verifyCoupleRequest
};