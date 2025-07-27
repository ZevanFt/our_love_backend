const Router = require('koa-router')

const { verifyToken } = require('../middleware/auth.middleware')
const { uploadImage } = require('../utils/image.util')

const router = new Router({ prefix: '/upload' })

router.post('/products', verifyToken, uploadImage)

router.post('/avatar', verifyToken, uploadImage)

router.post('/carousel', verifyToken, uploadImage)

module.exports = router