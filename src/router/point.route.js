const Router = require('@koa/router');
const { verifyToken } = require('../middleware/auth.middleware');
const { validator } = require('../middleware/product.middleware');
const {
  exchangeProduct,
  findRecords,
  getUserPoints,
} = require('../controller/point.controller');

const router = new Router({ prefix: '/points' });

// 兑换商品 (需要登录)
router.post(
  '/exchange',
  verifyToken,
  validator({
    product_id: 'int',
  }),
  exchangeProduct,
);

// 查询个人积分记录 (需要登录)
router.get('/records', verifyToken, findRecords);

// 查询当前用户总积分 (需要登录)
router.get('/', verifyToken, getUserPoints);

module.exports = router;
