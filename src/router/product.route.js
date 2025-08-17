const Router = require('@koa/router');
const { auth } = require('../middleware/auth.middleware');
const { validator } = require('../middleware/product.middleware');
const {
  create,
  update,
  remove,
  restore,
  findAll,
  findOne,
  findMyProducts,
  exchangeProduct,
} = require('../controller/product.controller');

const router = new Router({ prefix: '/products' });

// 获取可兑换的商品列表 (对方发布的商品)
router.get('/', auth, findAll);

// 获取我发布的商品 (用于管理)
router.get('/me', auth, findMyProducts);

// 获取单个商品信息
router.get('/:id', auth, findOne);

// 新增商品（需要有链接情侣）
router.post(
  '/',
  auth,
  validator({
    name: 'string',
    points_cost: 'number',
    stock: 'number',
  }),
  create,
);

// 修改商品（需要有链接情侣）
router.put('/:id', auth, update);

// 下架商品（需要有链接情侣）
router.post('/:id/off', auth, remove);

// 上架商品 (需要有链接情侣，才可以有权限发布商品)
router.post('/:id/on', auth, restore);

// 上传商品图片
router.post('/image', auth, async (ctx) => {
  ctx.body = 'ok';
});

// 兑换商品
router.post('/exchange', auth, exchangeProduct);

module.exports = router;
