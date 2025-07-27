const Router = require('koa-router')
const { verifyToken } = require('../middleware/auth.middleware')
const { validator } = require('../middleware/product.middleware')
const {
    create,
    update,
    remove,
    restore,
    findAll,
    findOne,
} = require('../controller/product.controller')

const router = new Router({ prefix: '/products' })

// 获取商品列表（需要有链接情侣）
router.get('/', findAll)

// 获取单个商品信息
router.get('/:id', findOne)

// 新增商品（需要有链接情侣）
router.post(
    '/',
    verifyToken,
    validator({
        name: 'string',
        points_cost: 'number',
        stock: 'number',
    }),
    create
)

// 修改商品（需要有链接情侣）
router.put('/:id', verifyToken, update)

// 下架商品（需要有链接情侣）
router.post('/:id/off', verifyToken, remove)

// 上架商品 (需要有链接情侣，才可以有权限发布商品)
router.post('/:id/on', verifyToken, restore)

// 上传商品图片
router.post('/image', verifyToken, async (ctx) => {
    ctx.body = 'ok'
})

module.exports = router
