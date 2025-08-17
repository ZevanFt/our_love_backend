const Router = require('@koa/router');
const { auth } = require('../middleware/auth.middleware');
const {
  findRecords,
  getUserPoints,
} = require('../controller/point.controller');

const router = new Router({ prefix: '/points' });

// 查询个人积分记录 (需要登录)
router.get('/records', auth, findRecords);

// 查询当前用户总积分 (需要登录)
router.get('/', auth, getUserPoints);

module.exports = router;
