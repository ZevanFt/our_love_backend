const notificationService = require('../service/notification.service');

class NotificationController {
  // 将通知标记为已读
  async markAsRead(ctx) {
    const { id } = ctx.params;
    const user_id = ctx.state.user.id;
    try {
      const result = await notificationService.updateNotificationStatus(
        id,
        user_id,
      );
      if (result) {
        ctx.body = {
          code: 0,
          message: '通知标记为已读成功',
          result: '',
        };
      } else {
        ctx.body = {
          code: 10001,
          message: '通知不存在或无权限操作',
          result: '',
        };
      }
    } catch (error) {
      console.error('标记通知为已读时出错', error);
      ctx.app.emit(
        'error',
        { code: 10002, message: '标记通知为已读时出错' },
        ctx,
      );
    }
  }

  // 获取所有未读通知
  async getUnread(ctx) {
    const user_id = ctx.state.user.id;
    try {
      const notifications = await notificationService.getNotifications(
        user_id,
        false,
      );
      ctx.body = {
        code: 0,
        message: '获取未读通知成功',
        result: notifications,
      };
    } catch (error) {
      console.error('获取未读通知时出错', error);
      ctx.app.emit(
        'error',
        { code: 10003, message: '获取未读通知时出错' },
        ctx,
      );
    }
  }

  // 获取所有通知
  async getAll(ctx) {
    const user_id = ctx.state.user.id;
    try {
      const notifications = await notificationService.getNotifications(user_id);
      ctx.body = {
        code: 0,
        message: '获取所有通知成功',
        result: notifications,
      };
    } catch (error) {
      console.error('获取所有通知时出错', error);
      ctx.app.emit(
        'error',
        { code: 10004, message: '获取所有通知时出错' },
        ctx,
      );
    }
  }

  // 获取所有已读通知
  async getRead(ctx) {
    const user_id = ctx.state.user.id;
    try {
      const notifications = await notificationService.getNotifications(
        user_id,
        true,
      );
      ctx.body = {
        code: 0,
        message: '获取已读通知成功',
        result: notifications,
      };
    } catch (error) {
      console.error('获取已读通知时出错', error);
      ctx.app.emit(
        'error',
        { code: 10005, message: '获取已读通知时出错' },
        ctx,
      );
    }
  }
}

module.exports = new NotificationController();
