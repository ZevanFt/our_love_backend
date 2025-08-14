const Router = require('@koa/router');

const { verifyToken } = require('../middleware/auth.middleware');
const {
  markAsRead,
  getUnread,
  getAll,
  getRead,
} = require('../controller/notification.controller');

const router = new Router({ prefix: '/notifications' });

// 将通知标记为已读
router.patch('/:id/read', verifyToken, markAsRead);

// 获取所有未读通知
router.get('/unread', verifyToken, getUnread);

// 获取所有通知
router.get('/', verifyToken, getAll);

// 获取所有已读通知
router.get('/read', verifyToken, getRead);

module.exports = router;
