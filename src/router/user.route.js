const Router = require('@koa/router');
// 引入中间件
const { auth } = require('../middleware/auth.middleware');
const {
  userValidator,
  verifyUser,
  encryptPassword,
  verifyPassword,
  verifyLogin,
  verifyCoupleRequest,
} = require('../middleware/user.middleware');
// 引入控制器
const {
  register,
  login,
  logout,
  getUserInfo,
  linkCouple,
  unlinkCouple,
  checkCoupleRequest,
} = require('../controller/user.controller');

const router = new Router({ prefix: '/user' });

router.get('/', async (ctx) => {
  ctx.body = '测试用户路由';
});

// 注册
router.post('/register', userValidator, verifyUser, encryptPassword, register);

// 登录
router.post('/login', userValidator, verifyLogin, login);

// 退出登录
router.post('/logout', auth, logout);

// 个人信息
router.get('/info', auth, getUserInfo);

// 修改密码
router.post('/reset-pwd', auth, verifyPassword, async (ctx) => {
  ctx.body = '修改密码';
  // 旧密码，新密码
  // 校验旧密码是否正确
  // 正确才可以重置新密码
});

// 检查用户自身有无未处理的请求
router.get('/check-couple-request', auth, checkCoupleRequest);

// 链接情侣关系
// 链接情侣关系需要双方同意把？
// 双方都同意后才可以链接
router.post('/link-couple', auth, verifyCoupleRequest, linkCouple);

// 解除情侣关系
router.post('/unlink-couple', auth, unlinkCouple);

// 校验旧密码

// 更新个人信息
router.post('/update', async (ctx) => {
  ctx.body = '更新个人信息路由';
});

// 下载头像
router.get('/avatar', async (ctx) => {
  ctx.body = '下载头像路由';
});

module.exports = router;
