const Router = require('@koa/router');
const { auth } = require('../middleware/auth.middleware');
const {
  getMyCoupons,
  getUserCoupons,
  useCoupon,
  confirmCoupon,
} = require('../controller/coupon.controller');

const router = new Router({ prefix: '/coupons' });

// 获取我的卡券列表
router.get('/', auth, getMyCoupons);

// 获取TA的卡券列表
router.get('/user/:userId', auth, getUserCoupons);

// 发起核销（持券方）
router.post('/use', auth, useCoupon);

// 确认核销（发行方）
router.post('/confirm', auth, confirmCoupon);

module.exports = router;
