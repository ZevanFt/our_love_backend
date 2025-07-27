// 从 sequelize 库中解构出 Op 对象，用于构建复杂的数据库查询条件
const { Op } = require('sequelize');
// 引入从 user.model.js 文件中导出的 getUserModel 函数，用于获取 User 模型
const { getUserModel } = require('../model/user.model');
// 引入从 tokenBlacklist.model.js 文件中导出的 getTokenBlacklistModel 函数，用于获取 TokenBlacklist 模型
const { getTokenBlacklistModel } = require('../model/tokenBlacklist.model');
// 引入从 notification.model.js 文件中导出的 getNotificationModel 函数，用于获取 Notification 模型
const { getNotificationModel } = require('../model/notification.model');
// 引入从 console.utils.js 文件中导出的 accessService 函数，用于记录服务访问日志
const { accessService } = require('../utils/console.utils');
// 从配置文件中引入 JWT_SECRET 常量，用于 JWT 令牌的签名
const { JWT_SECRET } = require('../config/config.default');
// 引入 jsonwebtoken 库，用于处理 JWT 令牌相关操作
const jwt = require('jsonwebtoken');
// 引入 NotificationService 类
const notificationService = require('./notification.service');

// 定义异步函数来同步 User 模型
const syncUserModel = async () => {
    try {
        const User = await getUserModel();
        if (!User) {
            console.error('未能正确获取 User 模型');
            return;
        }
        // 使用 alter: true 自动修改表结构
        // await User.sync({ alter: true });
        // console.log('User 模型对应的数据库表结构已更新');
        await User.sync();
        console.log('User模型对应的数据库表结构已更新-未启用alter');
    } catch (error) {
        console.error('更新 User 模型对应的数据库表结构时出错:', error);
    }
};

// 初始化时调用同步函数
syncUserModel();

/**
 * UserService 类，封装了与用户相关的数据库操作服务
 */
class UserService {
    /**
     * 创建新用户的异步方法
     * @param {string} name - 用户的昵称
     * @param {string} yier_number - 用户的唯一账号
     * @param {string} password - 用户的登录密码
     * @returns {Object} - 新创建用户的数据库记录数据
     */
    async createUser(name, yier_number, password) {
        // 调用 accessService 函数记录本次 createUser 服务的访问日志
        accessService('createUser');
        // 调用 getUserModel 函数获取 User 模型
        const User = await getUserModel();
        // 调用 User 模型的 create 方法，在数据库中创建一条新的用户记录
        const res = await User.create({
            name, // 用户昵称
            yier_number, // 用户账号
            password // 用户密码
        });
        // 打印创建用户成功的日志，并输出新用户的记录数据
        console.log('创建用户成功', res.dataValues);
        // 返回新创建用户记录的原始数据值
        return res.dataValues;
    }

    /**
     * 根据传入的参数查询用户信息的异步方法
     * @param {Object} params - 查询参数对象
     * @param {number} [params.id] - 用户的唯一标识符
     * @param {string} [params.yier_number] - 用户的唯一账号
     * @param {string} [params.password] - 用户的登录密码
     * @param {string} [params.name] - 用户的昵称
     * @returns {Object|null} - 如果找到用户，返回用户数据；否则返回 null
     */
    async getUser({ id, yier_number, password, name }) {
        // 调用 accessService 函数记录本次 getUser 服务的访问日志
        accessService('getUser');
        // 初始化查询条件对象
        const whereOpt = {};
        // 如果传入了 id 参数，将其添加到查询条件对象中
        id && Object.assign(whereOpt, { id });
        // 如果传入了 yier_number 参数，将其添加到查询条件对象中
        yier_number && Object.assign(whereOpt, { yier_number });
        // 如果传入了 password 参数，将其添加到查询条件对象中
        password && Object.assign(whereOpt, { password });
        // 如果传入了 name 参数，将其添加到查询条件对象中
        name && Object.assign(whereOpt, { name });
        // 打印查询条件对象
        console.log(whereOpt, '查询条件对象');

        // 调用 getUserModel 函数获取 User 模型
        const User = await getUserModel();
        // 调用 User 模型的 findOne 方法，在数据库中查找符合条件的第一条用户记录
        const res = await User.findOne({
            where: whereOpt
        });
        // 如果找到用户记录，返回该记录的原始数据值；否则返回 null
        return res ? res.dataValues : null;
    }

    /**
     * 更新用户信息的异步方法
     * @param {number} id - 用户的唯一标识符
     * @param {string} name - 用户的新昵称
     * @param {string} yier_number - 用户的新账号
     * @param {string} password - 用户的新密码
     * @returns {Array} - 更新操作的结果数组
     */
    async updateUser(id, name, yier_number, password) {
        // 调用 accessService 函数记录本次 updateUser 服务的访问日志
        accessService('updateUser');
        // 调用 getUserModel 函数获取 User 模型
        const User = await getUserModel();
        // 调用 User 模型的 update 方法，更新数据库中符合条件的用户记录
        const res = await User.update({
            name, // 用户新昵称
            yier_number, // 用户新账号
            password // 用户新密码
        }, {
            where: { id } // 根据用户 ID 定位要更新的记录
        });
        // 返回更新操作的结果数组
        return res;
    }

    /**
     * 将 JWT 令牌添加到黑名单的异步方法
     * @param {string} token - 需要添加到黑名单的 JWT 令牌
     */
    async addTokenToBlacklist(token) {
        // 调用 accessService 函数记录本次 addTokenToBlacklist 服务的访问日志
        accessService('addTokenToBlacklist');
        // 调用 getTokenBlacklistModel 函数获取 TokenBlacklist 模型
        const TokenBlacklist = await getTokenBlacklistModel();
        // 解码 JWT 令牌，获取令牌的过期时间
        const decoded = jwt.decode(token);
        // 将令牌的过期时间转换为 Date 对象
        const expiresAt = new Date(decoded.exp * 1000);
        // 调用 TokenBlacklist 模型的 create 方法，在数据库中创建一条新的黑名单记录
        await TokenBlacklist.create({
            token, // JWT 令牌
            expires_at: expiresAt // 令牌过期时间
        });
    }

    /**
     * 检查 JWT 令牌是否在黑名单中的异步方法
     * @param {string} token - 需要检查的 JWT 令牌
     * @returns {boolean} - 如果令牌在黑名单中返回 true，否则返回 false
     */
    async isTokenBlacklisted(token) {
        // 调用 accessService 函数记录本次 isTokenBlacklisted 服务的访问日志
        accessService('isTokenBlacklisted');
        // 调用 getTokenBlacklistModel 函数获取 TokenBlacklist 模型
        const TokenBlacklist = await getTokenBlacklistModel();
        // 调用 TokenBlacklist 模型的 findOne 方法，在数据库中查找符合条件的黑名单记录
        const blacklistedToken = await TokenBlacklist.findOne({
            where: { token } // 根据令牌字符串进行查询
        });
        // 如果找到黑名单记录，返回 true；否则返回 false
        return blacklistedToken !== null;
    }

    /**
     * 发送情侣请求的异步方法
     * 该方法会检查是否存在未处理的情侣请求，若不存在则创建一条新的情侣请求记录
     * @param {number} requesterId - 请求发送者的用户 ID
     * @param {number} targetId - 请求接收者的用户 ID
     */
    async sendCoupleRequest(requesterId, targetId) {
        // 调用 accessService 函数，记录本次 sendCoupleRequest 服务的访问日志，便于后续调试和监控
        accessService('sendCoupleRequest');
        // 调用 getUserModel 函数，异步获取 User 模型，用于后续数据库操作
        const User = await getUserModel();
        // 调用 User 模型的 findOne 方法，在数据库中查找是否存在未处理的情侣请求
        const existingRequest = await User.findOne({
            where: {
                [Op.or]: [
                    // 检查当前请求发送者发送给目标用户的未处理情侣请求
                    { coupleRequestRequesterId: requesterId, coupleRequestTargetId: targetId, coupleRequestStatus: 'pending' },
                    // 检查目标用户发送给当前请求发送者的未处理情侣请求
                    { coupleRequestRequesterId: targetId, coupleRequestTargetId: requesterId, coupleRequestStatus: 'pending' }
                ]
            }
        });

        // 如果查找到未处理的情侣请求，抛出错误，阻止重复发送请求
        if (existingRequest) {
            throw new Error('已经存在未处理的情侣请求');
        }

        // 若不存在未处理的请求，调用 User 模型的 update 方法，创建一条新的情侣请求记录
        await User.update(
            {
                coupleRequestRequesterId: requesterId, // 记录请求发送者的用户 ID
                coupleRequestTargetId: targetId, // 记录请求接收者的用户 ID
                coupleRequestStatus: 'pending' // 设置请求状态为待处理
            },
            { where: { id: requesterId } } // 根据请求发送者的用户 ID 定位要更新的记录
        );

        // 创建情侣链接请求通知
        await notificationService.createCoupleLinkRequestNotification(targetId, requesterId);
    }

    /**
     * 同意情侣请求的异步方法
     * @param {number} targetId - 接收请求的用户 ID（被链接用户）
     * @param {number} requesterId - 请求发送者的用户 ID
     * @param {number} notificationId - 通知的 ID
     */
    async acceptCoupleRequest(targetId, requesterId, notificationId) {
        // 调用 accessService 函数，记录本次 acceptCoupleRequest 服务的访问日志
        accessService('acceptCoupleRequest');
        const User = await getUserModel();

        // 更新情侣请求状态为 accepted
        await User.update(
            {
                coupleRequestStatus: 'accepted',
                mate_id: requesterId,
                // 可根据业务逻辑更新其他关联字段
            },
            { where: { id: targetId } }
        );

        // 更新通知状态为 accepted
        await notificationService.updateNotificationStatus(notificationId, 'accepted');
    }

    /**
     * 拒绝情侣请求的异步方法
     * @param {number} targetId - 接收请求的用户 ID（被链接用户）
     * @param {number} requesterId - 请求发送者的用户 ID
     * @param {number} notificationId - 通知的 ID
     */
    async rejectCoupleRequest(targetId, requesterId, notificationId) {
        // 调用 accessService 函数，记录本次 rejectCoupleRequest 服务的访问日志
        accessService('rejectCoupleRequest');
        const User = await getUserModel();

        // 更新情侣请求状态为 rejected
        await User.update(
            {
                coupleRequestStatus: 'rejected'
            },
            { where: { id: targetId } }
        );

        // 更新通知状态为 rejected
        await notificationService.updateNotificationStatus(notificationId, 'rejected');
    }

    /**
     * 检查两个用户是否为情侣关系的异步方法
     * @param {number} userId1 - 第一个用户的 ID
     * @param {number} userId2 - 第二个用户的 ID
     * @returns {boolean} - 如果两个用户是情侣关系返回 true，否则返回 false
     */
    async checkCoupleStatus(userId1, userId2) {
        // 调用 accessService 函数记录本次 checkCoupleStatus 服务的访问日志
        accessService('checkCoupleStatus');
        // 调用 getUserModel 函数获取 User 模型
        const User = await getUserModel();
        // 调用 User 模型的 findByPk 方法，根据用户 ID 查找第一个用户的记录
        const user1 = await User.findByPk(userId1);
        // 调用 User 模型的 findByPk 方法，根据用户 ID 查找第二个用户的记录
        const user2 = await User.findByPk(userId2);
        // 判断两个用户的情侣 ID 是否相互匹配，如果匹配则返回 true，否则返回 false
        return user1.mate_id === userId2 && user2.mate_id === userId1;
    }

    /**
     * 创建情侣请求通知
     * 该方法用于在用户发送情侣请求时，创建一条对应的通知记录，通知接收方有新的情侣请求
     * @param {number} senderId - 发送情侣请求的用户 ID
     * @param {number} receiverId - 接收情侣请求的用户 ID
     * @returns {Promise<Model>} - 返回一个 Promise，解析为新创建的通知记录实例
     */
    async createCoupleRequestNotification(senderId, receiverId) {
        // 调用 accessService 函数，记录本次 createCoupleRequestNotification 服务的访问日志
        accessService('createCoupleRequestNotification');
        // 调用 getNotificationModel 函数，异步获取 Notification 模型
        const Notification = await getNotificationModel();
        // 调用 getUserModel 函数，异步获取 User 模型
        const User = await getUserModel();
        // 根据发送者的用户 ID，使用 User 模型的 findByPk 方法，从数据库中查找发送者的用户记录
        const sender = await User.findByPk(senderId);
        // 构造通知内容，包含发送者的昵称
        const content = `${sender.name} 向你发送了情侣关系请求`;
        // 调用 Notification 模型的 create 方法，在数据库中创建一条新的通知记录
        // 传入包含接收者 ID、发送者 ID、通知类型和通知内容的对象
        return await Notification.create({
            receiver_id: receiverId, // 接收者用户 ID
            sender_id: senderId, // 发送者用户 ID
            type: 'couple_request', // 通知类型为情侣请求
            content // 通知内容
        });
    }

    /**
     * 获取用户的未读通知
     * @param {number} userId - 用户 ID
     * @returns {Array} - 未读通知列表
     */
    async getUnreadNotifications(userId) {
        accessService('getUnreadNotifications');
        const Notification = await getNotificationModel();
        return await Notification.findAll({
            where: {
                receiver_id: userId,
                status: 'unread'
            }
        });
    }

    /**
     * 处理情侣请求通知状态
     * @param {number} notificationId - 通知 ID
     * @param {'accepted'|'rejected'} status - 处理状态
     */
    async handleCoupleRequestNotification(notificationId, status) {
        accessService('handleCoupleRequestNotification');
        const Notification = await getNotificationModel();
        const notification = await Notification.findByPk(notificationId);
        if (notification) {
            notification.status = status;
            await notification.save();
            if (status === 'accepted') {
                await this.acceptCoupleRequest(notification.receiver_id, notification.sender_id);
            }
        }
    }
}

// 创建 UserService 类的实例
const userServiceInstance = new UserService();
// 导出 UserService 类的实例，供其他模块使用
module.exports = userServiceInstance;