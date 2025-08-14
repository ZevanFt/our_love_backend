const jwt = require('jsonwebtoken');
const { accessController } = require('../utils/console.utils');
const userService = require('../service/user.service');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config.default');

console.log('user-控制器-生成令牌使用的 JWT_SECRET:', JWT_SECRET);
console.log('user-控制器-令牌有效期:', JWT_EXPIRES_IN);

class UserController {
  /**
   * 处理用户注册请求的异步方法
   * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
   * @param {function} next - 调用下一个中间件的函数
   */
  async register(ctx) {
    accessController('register');
    // 从请求体中解构出用户名和密码
    const { name, yier_number, password } = ctx.request.body;
    try {
      // 2、操作数据库，调用 createUser 函数创建新用户
      // 该函数应该是从其他模块引入的，用于向数据库插入新用户记录
      const res = await userService.createUser(name, yier_number, password);
      // 3、返回结果，设置响应体信息，告知客户端用户注册成功
      ctx.body = {
        code: '0', // 状态码，0 表示操作成功
        message: '用户注册成功', // 提示信息
        result: {
          id: res.id, // 新用户的 ID
          name: res.name, // 新用户的姓名
          yier_number: res.yier_number, // 新用户的学号
        },
      };
      // 打印数据库操作返回的结果，方便调试
      console.log(res);
    } catch (err) {
      console.log(err);
      // 若在创建用户过程中出现错误，触发错误事件
      // userRegisterError 应该是从其他模块引入的错误类型常量
      // return ctx.app.emit('error', userRegisterError, ctx)
      return (ctx.body = {
        code: '1', // 状态码，1 表示操作失败
        message: '用户注册失败' + err.message, // 提示信息
        result: {}, // 空对象，用于占位
      });
    }
  }

  /**
   * 处理用户登录请求的异步方法
   * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
   * @param {function} next - 调用下一个中间件的函数
   */
  async login(ctx) {
    // 调用访问控制器日志函数，记录本次控制器访问信息
    accessController('login');
    // 从请求体中解构出用户账号
    const { yier_number } = ctx.request.body;
    try {
      // 操作数据库，调用 login 函数进行登录验证
      // 该函数应该是从其他模块引入的，用于查询用户记录并验证密码
      // eslint-disable-next-line no-unused-vars
      const { password, id, ...res } = await userService.getUser({
        yier_number,
      });
      // 生成 JWT 令牌，将用户 ID 作为 payload，使用配置的密钥进行签名，设置令牌有效期为 7 天
      // 使用 jsonwebtoken 库的 sign 方法生成 JWT 令牌
      // 第一个参数为 payload，是一个包含用户 ID 的对象，用于在令牌中存储用户身份信息
      // 第二个参数为签名密钥，从配置文件中获取，用于对令牌进行签名，确保令牌的完整性和真实性
      // 第三个参数为配置选项，设置令牌的有效期为 7 天
      const token = jwt.sign(
        { id }, // 包含用户 ID 的 payload 对象
        JWT_SECRET, // 签名密钥，用于对令牌进行签名
        { expiresIn: JWT_EXPIRES_IN }, // 配置选项，设置令牌有效期为 7 天
      );
      // 返回结果，设置响应体信息，告知客户端用户登录成功，并携带 JWT 令牌
      ctx.body = {
        code: 0, // 状态码，0 表示操作成功
        message: '用户登录成功', // 提示信息
        result: {
          token: token, // 新添加的 JWT 令牌字段
          user: { ...res, id },
        },
      };
      // 打印数据库操作返回的结果，方便调试
      console.log(res);
    } catch (err) {
      // 打印登录验证过程中出现的错误信息
      console.log(err);
      // 若在登录验证过程中出现错误，直接返回错误响应给客户端
      return (ctx.body = {
        code: 1, // 状态码，1 表示操作失败
        message: '用户登录失败' + err.message, // 提示信息
        result: {}, // 空对象，用于占位
      });
    }
  }

  /**
   * 处理用户退出登录请求的异步方法
   * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
   * @param {function} next - 调用下一个中间件的函数
   */
  async logout(ctx) {
    accessController('logout');
    const token = ctx.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        await userService.addTokenToBlacklist(token);
      } catch (err) {
        console.error('将令牌加入黑名单失败-用户退出登录:', err);
        ctx.body = {
          code: 1,
          message: '退出登录失败',
          result: {},
        };
        return;
      }
    }
    ctx.body = {
      code: 0,
      message: '用户退出登录成功',
      result: {},
    };
  }

  /**
   * 获取用户信息的异步方法
   * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
   * @param {function} next - 调用下一个中间件的函数
   */
  async getUserInfo(ctx) {
    accessController('getUserInfo');
    try {
      let userId = ctx.state.user.id;
      console.log(userId, ctx.state.user.id);

      if (!userId) {
        // 从请求头获取 JWT 令牌
        const token = ctx.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          ctx.body = {
            code: '1',
            message: '未提供令牌',
            result: {},
          };
          return;
        }
        // 解码令牌获取用户 ID
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      }

      // 调用服务层方法获取用户信息
      // eslint-disable-next-line no-unused-vars
      const { password, ...userInfo } = await userService.getUser({
        id: userId,
      });
      // const userInfo = await getUser({ id: userId });

      if (userInfo) {
        ctx.body = {
          code: '0',
          message: '获取用户信息成功',
          result: userInfo,
        };
      } else {
        ctx.body = {
          code: '2',
          message: '未找到用户信息',
          result: {},
        };
      }
    } catch (err) {
      console.error('获取用户信息失败:', err);
      ctx.body = {
        code: '3',
        message: '获取用户信息失败',
        result: {},
      };
    }
  }

  /**
   * 处理链接情侣关系的请求
   * 支持发送情侣请求和接受情侣请求两种操作
   * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
   * @param {function} next - 调用下一个中间件的函数
   */
  async linkCouple(ctx) {
    // 调用 accessController 函数，记录本次 linkCouple 控制器方法的访问日志
    accessController('linkCouple');
    try {
      // 从请求体中解构出目标用户 ID 和操作类型
      // targetUserId 为目标用户的 ID，action 为操作类型（'send' 表示发送请求，'accept' 表示接受请求）
      const { targetUserId, action } = ctx.request.body;
      // 从 Koa 上下文的 state 中获取当前用户的 ID
      // 假设在验证令牌的中间件中已经将用户 ID 存储在 ctx.state.user.id
      const userId = ctx.state.user.id;
      // 验证请求数据的完整性，若目标用户 ID 或操作类型缺失，则返回错误响应
      if (!targetUserId || !action) {
        ctx.body = {
          code: 400, // 状态码 400 表示客户端请求错误
          message: '缺少必要参数', // 错误提示信息
          result: {}, // 空结果对象
        };
        return; // 结束当前函数执行
      }

      // 调用 checkCoupleStatus 服务方法，检查当前用户和目标用户是否已经是情侣关系
      const isCoupled = await userService.checkCoupleStatus(
        userId,
        targetUserId,
      );
      if (isCoupled) {
        ctx.body = {
          code: 400, // 状态码 400 表示客户端请求错误
          message: '双方已经是情侣关系', // 错误提示信息
          result: {}, // 空结果对象
        };
        return; // 结束当前函数执行
      }
      console.log('情侣请求类型为：', action);
      // 根据操作类型执行不同的逻辑
      if (action === 'send') {
        // 调用 sendCoupleRequest 服务方法，向目标用户发送情侣请求
        await userService.sendCoupleRequest(userId, targetUserId);
        ctx.body = {
          code: 0, // 状态码 0 表示操作成功
          message: '情侣请求已发送，等待对方确认', // 成功提示信息
          result: {}, // 空结果对象
        };
      } else if (action === 'accept') {
        // 调用 acceptCoupleRequest 服务方法，接受来自目标用户的情侣请求
        await userService.acceptCoupleRequest(userId, targetUserId);
        ctx.body = {
          code: 0, // 状态码 0 表示操作成功
          message: '已成功建立情侣关系', // 成功提示信息
          result: {}, // 空结果对象
        };
      } else {
        // 若操作类型既不是 'send' 也不是 'accept'，则返回无效操作类型的错误响应
        ctx.body = {
          code: 400, // 状态码 400 表示客户端请求错误
          message: '无效的操作类型', // 错误提示信息
          result: {}, // 空结果对象
        };
      }
    } catch (err) {
      // 捕获并打印操作过程中出现的错误信息
      console.error('链接情侣关系失败:', err.message);
      ctx.body = {
        code: 500, // 状态码 500 表示服务器内部错误
        message: '链接情侣关系失败', // 错误提示信息
        // result: {}, // 空结果对象
        result: err.message, // 空结果对象
      };
    }
  }

  // 检查用户自身有无未处理的请求
  async checkCoupleRequest(ctx) {
    accessController('checkCoupleRequest');
    try {
      const userId = ctx.state.user.id; // 当前操作的用户
      const requests = await userService.hasPendingCoupleRequest(userId);
      ctx.body = {
        code: 0,
        message: '检查请求成功',
        result: requests,
      };
    } catch (err) {
      console.error('检查请求失败:', err);
      ctx.body = {
        code: 500,
        message: `检查请求失败: ${err.message}`,
        result: {},
      };
    }
  }

  /**
   * 处理解除情侣关系的请求
   * @param {object} ctx - Koa 上下文对象
   */
  async unlinkCouple(ctx) {
    accessController('unlinkCouple');
    try {
      const { action, notificationId, requesterId } = ctx.request.body;
      const userId = ctx.state.user.id; // 当前操作的用户

      if (action === 'send_breakup') {
        await userService.sendBreakupRequest(userId);
        ctx.body = {
          code: 0,
          message: '解除关系请求已发送，等待对方确认',
          result: {},
        };
      } else if (action === 'accept_breakup') {
        if (!notificationId || !requesterId) {
          ctx.body = { code: 400, message: '缺少必要参数' };
          return;
        }
        // 在接受解除请求时，当前用户是 targetId，发起者是 requesterId
        await userService.acceptBreakupRequest(
          userId,
          requesterId,
          notificationId,
        );
        ctx.body = {
          code: 0,
          message: '已成功解除情侣关系',
          result: {},
        };
      } else {
        ctx.body = {
          code: 400,
          message: '无效的操作类型',
          result: {},
        };
      }
    } catch (err) {
      console.error('解除情侣关系失败:', err);
      ctx.body = {
        code: 500,
        message: `解除情侣关系失败: ${err.message}`,
        result: {},
      };
    }
  }
}
module.exports = new UserController();
