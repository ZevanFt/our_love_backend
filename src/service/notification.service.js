const { getNotificationModel } = require('../model/notification.model');

// 定义同步 Notification 模型的异步函数
const syncNotificationModel = async () => {
    try {
        const Notification = await getNotificationModel();
        if (!Notification) {
            console.error('未能正确获取 Notification 模型');
            return;
        }
        console.log('Notification 模型对应的数据库表结构已更新');
    } catch (error) {
        console.error('更新 Notification 模型对应的数据库表结构时出错:', error);
    }
};

// 在服务初始化时调用同步函数
syncNotificationModel();

/**
 * NotificationService 类，封装了与通知相关的数据库操作服务
 */
class NotificationService {
    /**
     * 创建情侣链接请求通知
     * @param {number} receiverId - 被链接用户（目标用户）的 ID
     * @param {number} senderId - 发起链接请求的用户 ID
     * @returns {Promise<Object>} - 返回新创建的通知记录
     */
    async createCoupleLinkRequestNotification(receiverId, senderId) {
        const Notification = await getNotificationModel();
        const notificationData = {
            receiver_id: receiverId,
            sender_id: senderId,
            type: 'couple_link_request',
            content: `用户 ID 为 ${senderId} 的用户向你发起了情侣链接请求`,
            status: 'unread'
        };
        return Notification.create(notificationData);
    }

    /**
     * 更新通知状态
     * @param {number} notificationId - 通知的 ID
     * @param {string} status - 要更新的状态，如 'read', 'accepted', 'rejected'
     * @returns {Promise<number>} - 返回受影响的行数
     */
    async updateNotificationStatus(notificationId, status) {
        const Notification = await getNotificationModel();
        return Notification.update(
            { status },
            { where: { id: notificationId } }
        );
    }

    /**
     * 创建通知
     * @param {Object} notificationData - 通知数据对象
     * @returns {Promise<Object>} - 返回新创建的通知记录
     */
    async createNotification(notificationData) {
        const Notification = await getNotificationModel();
        return Notification.create(notificationData);
    }

    /**
     * 获取用户的通知列表
     * @param {number} userId - 用户 ID
     * @returns {Promise<Array>} - 返回用户的通知列表
     */
    async getNotifications(userId) {
        const Notification = await getNotificationModel();
        const notifications = await Notification.findAll({
            where: { receiver_id: userId }
        });

        // 将未读通知状态更新为已读
        for (const notification of notifications) {
            if (notification.status === 'unread') {
                await this.updateNotificationStatus(notification.id, 'read');
            }
        }

        return notifications;
    }
}

module.exports = new NotificationService();
