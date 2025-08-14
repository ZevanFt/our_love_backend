const { getNotificationModel } = require('../model/notification.model');
const { accessService } = require('../utils/console.utils');

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
   * 创建通知
   * @param {Object} notificationData - 通知数据对象
   * @param {number|number[]} notificationData.receiver_id - 接收者ID或ID数组
   * @param {number} notificationData.sender_id - 发送者ID
   * @param {string} notificationData.type - 通知类型
   * @param {string} notificationData.content - 通知内容
   * @returns {Promise<Object|Object[]>} - 返回创建的通知记录
   */
  async createNotification({ receiver_id, sender_id, type, content }) {
    const Notification = await getNotificationModel();

    if (Array.isArray(receiver_id)) {
      const notifications = receiver_id.map((id) => ({
        receiver_id: id,
        sender_id,
        type,
        content,
      }));
      return Notification.bulkCreate(notifications);
    } else {
      return Notification.create({ receiver_id, sender_id, type, content });
    }
  }

  /**
   * 将通知标记为已读
   * @param {number} notificationId - 通知的 ID
   * @param {number} userId - 当前用户的 ID
   * @returns {Promise<[number]>} - 返回受影响的行数
   */
  async updateNotificationStatus(notificationId, userId) {
    const Notification = await getNotificationModel();
    return Notification.update(
      { is_read: true },
      { where: { id: notificationId, receiver_id: userId } },
    );
  }

  /**
   * 获取用户的通知列表
   * @param {number} userId - 用户 ID
   * @param {boolean} [is_read] - 可选参数，用于筛选已读或未读通知。true为已读，false为未读，不提供则返回所有通知。
   * @returns {Promise<Array>} - 返回用户的通知列表
   */
  async getNotifications(userId, is_read = null) {
    accessService('getNotifications');
    const Notification = await getNotificationModel();
    const where = { receiver_id: userId };

    if (is_read !== null) {
      where.is_read = is_read;
    }

    return Notification.findAll({ where });
  }
}

module.exports = new NotificationService();
